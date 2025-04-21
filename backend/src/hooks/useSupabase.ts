import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Database } from '@/types/supabase'

type TableName = keyof Database['public']['Tables']

export function useSupabase<T extends TableName>(tableName: T) {
    const supabase = createClient()

    const fetch = useCallback(
        async (query?: string) => {
            let queryBuilder = supabase.from(tableName).select('*')

            if (query) {
                queryBuilder = queryBuilder.textSearch('name', query)
            }

            const { data, error } = await queryBuilder
            if (error) throw error
            return data as Database['public']['Tables'][T]['Row'][]
        },
        [tableName, supabase]
    )

    const create = useCallback(
        async (item: Database['public']['Tables'][T]['Insert']) => {
            const { data, error } = await supabase
                .from(tableName)
                .insert([item])
                .select()
            if (error) throw error
            return data[0] as Database['public']['Tables'][T]['Row']
        },
        [tableName, supabase]
    )

    const update = useCallback(
        async (
            id: string,
            item: Database['public']['Tables'][T]['Update']
        ) => {
            const { data, error } = await supabase
                .from(tableName)
                .update(item)
                .eq('id', id)
                .select()
            if (error) throw error
            return data[0] as Database['public']['Tables'][T]['Row']
        },
        [tableName, supabase]
    )

    const remove = useCallback(
        async (id: string) => {
            const { error } = await supabase.from(tableName).delete().eq('id', id)
            if (error) throw error
        },
        [tableName, supabase]
    )

    return {
        fetch,
        create,
        update,
        remove,
    }
} 