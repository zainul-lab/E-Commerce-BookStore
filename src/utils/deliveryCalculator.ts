export function getTentativeDeliveryDate(daysToAdd: number = 3): { dateString: string; fullDate: Date; formattedDay: string } {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const formattedDay = targetDate.toLocaleDateString('en-US', options);
  return {
    dateString: `Arrives by ${formattedDay}`,
    fullDate: targetDate,
    formattedDay
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function isWithin48Hours(createdAtIso: string): { canCancel: boolean; remainingHours: number; remainingMinutes: number; remainingSeconds: number; formattedRemaining: string } {
  const createdTime = new Date(createdAtIso).getTime();
  const cancelDeadline = createdTime + 48 * 60 * 60 * 1000;
  const now = new Date().getTime();
  const diffMs = cancelDeadline - now;

  if (diffMs <= 0) {
    return {
      canCancel: false,
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      formattedRemaining: 'Expired',
    };
  }

  const remainingHours = Math.floor(diffMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    canCancel: true,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    formattedRemaining: `${remainingHours}h ${remainingMinutes}m left to cancel`,
  };
}
