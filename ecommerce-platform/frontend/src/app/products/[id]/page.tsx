'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductDetailRedirect() {
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    router.replace(`/products/${params.id}`);
  }, [params.id, router]);
  return null;
}