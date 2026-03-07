'use client';
export default function AdminProductDetail({ params }: { params: { id: string } }) {
  return <div>Product {params.id}</div>;
}