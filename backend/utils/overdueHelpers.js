import paymentModel from "../models/payment.model.js";

export const getOverdueUsersData = async (today = new Date()) => {
  const getDateOnly = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const overduePayments = await paymentModel.find({
    status: "Finished",
    nextPaymentDueDate: { $lt: today },
    paidDate: { $gte: lastMonth, $lt: thisMonth },
  })
    .populate("shopId")
    .populate("userId", "username");

  const thisMonthPayments = await paymentModel.find({
    status: "Finished",
    paidDate: { $gte: thisMonth },
  });

  // Build a map of shopId => Set of payment types paid this month
  const shopPaymentsMap = {};
  thisMonthPayments.forEach((p) => {
    const shopId = p.shopId.toString();
    const type = p.paymentType;

    if (!shopPaymentsMap[shopId]) {
      shopPaymentsMap[shopId] = new Set();
    }
    shopPaymentsMap[shopId].add(type);
  });

  const result = overduePayments.filter((p) => {
    const shopAssigned = p.shopId?.userId !== null;
    const shopIdStr = p.shopId._id.toString();
    const paidTypes = shopPaymentsMap[shopIdStr] || new Set();

    // If both fees are already paid for this shop this month, skip it
    const hasPaidBothFees = paidTypes.has("Shop Rent Cost") && paidTypes.has("Overdue Fee");

    return shopAssigned && !hasPaidBothFees;
  });

  const resultWithDays = result.map((p) => {
    const dueDate = getDateOnly(new Date(p.nextPaymentDueDate));
    const cleanToday = getDateOnly(today);
    const overdueDays = Math.floor((cleanToday - dueDate) / (1000 * 60 * 60 * 24));
    return { ...p.toObject(), overdueDays };
  });

  return resultWithDays;
};
