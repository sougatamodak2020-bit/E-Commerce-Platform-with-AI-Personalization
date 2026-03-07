'use client';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  return (
    <div className="container mx-auto py-8">
      <h1>Product {params.id}</h1>
    </div>
  );
}