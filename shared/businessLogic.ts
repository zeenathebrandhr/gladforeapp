/**
 * Shared Business Logic Library
 * Isolated for cross-platform reuse (Web & React Native)
 */

/**
 * Calculate total cost from quantity and unit price
 */
export function calculateTotalCost(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

/**
 * Calculate required 50% down payment
 */
export function calculateDownPayment(totalCost: number): number {
  return totalCost * 0.5;
}

/**
 * Calculate remaining balance (50% after down payment)
 */
export function calculateRemainingBalance(totalCost: number): number {
  return totalCost * 0.5;
}

/**
 * Validate that the recorded down payment exactly matches 50% of total cost
 * Returns true if valid, false otherwise
 */
export function validateDownPayment(totalCost: number, recordedPayment: number): boolean {
  const requiredDownPayment = calculateDownPayment(totalCost);
  // Use small epsilon for floating point comparison
  return Math.abs(recordedPayment - requiredDownPayment) < 0.01;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Calculate payment due date (typically 30 days after order approval)
 */
export function calculatePaymentDueDate(approvalDate: Date, daysUntilDue: number = 30): Date {
  const dueDate = new Date(approvalDate);
  dueDate.setDate(dueDate.getDate() + daysUntilDue);
  return dueDate;
}

/**
 * Check if a payment is overdue
 */
export function isPaymentOverdue(dueDate: Date): boolean {
  return new Date() > new Date(dueDate);
}

/**
 * Get status badge variant based on status
 */
export function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'paid':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
    case 'overdue':
      return 'destructive';
    default:
      return 'outline';
  }
}
