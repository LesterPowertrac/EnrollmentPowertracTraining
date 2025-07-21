import { Suspense } from 'react';

export default function SuspenseWrapper({ children, fallback }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
