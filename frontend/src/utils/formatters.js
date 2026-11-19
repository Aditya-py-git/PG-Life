export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'active':
    case 'resolved':
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'scheduled':
    case 'in_progress':
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'declined':
    case 'closed':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const getGenderBadge = (gender) => {
  switch (gender?.toLowerCase()) {
    case 'female':
      return {
        label: 'Girls Only',
        className: 'bg-pink-50 text-pink-700 border-pink-200'
      };
    case 'male':
      return {
        label: 'Boys Only',
        className: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    case 'unisex':
    default:
      return {
        label: 'Co-Living / Unisex',
        className: 'bg-purple-50 text-purple-700 border-purple-200'
      };
  }
};
