import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    // Build tree structure
    const buildTree = (items: any[], parentId: string | null = null) => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };

    const tree = buildTree(data);

    return NextResponse.json({
      success: true,
      data: tree,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message },
    }, { status: 500 });
  }
}
