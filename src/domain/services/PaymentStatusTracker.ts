export interface PaymentStatusTracker {
  getPaymentStatusByAuthId(authId: string): Promise<Object>
}