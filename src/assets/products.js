export const products = [

];

export const categories = [
  { id: 'all',         label: 'All Products',   labelAr: 'جميع المنتجات' },
  { id: 'freebase',    label: 'Free Base',      labelAr: 'فري بيس' },
  { id: 'salt',        label: 'Salt Nicotine',  labelAr: 'سولت نيكوتين' },
  { id: 'devices',     label: 'Devices',        labelAr: 'الأجهزة' },
  { id: 'disposables', label: 'Disposables',    labelAr: 'ديسبوزابل' },
  { id: 'coils',       label: 'Coils & Pods',   labelAr: 'كويلز وبودز' },
  { id: 'pod-system',  label: 'Pod System',     labelAr: 'بود سيستم' },
];

// Alias for PodSystemPage — filters from the main products array
export const podSystemProducts = products.filter(p => p.category === 'pod-system')
