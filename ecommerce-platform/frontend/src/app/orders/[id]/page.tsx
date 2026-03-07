'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrderDetailRedirect() {
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/profile/orders/${params.id}`);
  }, [params.id, router]);
  return null;
}