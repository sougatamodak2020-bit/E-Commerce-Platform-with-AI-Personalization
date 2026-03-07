'use client';
export default function AdminOrderDetail({ params }: { params: { id: string } }) {
  return <div>Order {params.id}</div>;
}