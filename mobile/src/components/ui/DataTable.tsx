import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Checkbox } from './Checkbox';
import { EmptyState, type EmptyStateProps } from './EmptyState';
import { Skeleton } from './Skeleton';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/cn';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  /** Flex-grow weight relative to the other columns — defaults to 1. */
  weight?: number;
  align?: 'left' | 'right';
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowPress?: (row: T) => void;
  selectable?: boolean;
  selectedKeys?: ReadonlySet<string>;
  onToggleRow?: (key: string) => void;
  onToggleAll?: () => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyState?: Pick<EmptyStateProps, 'icon' | 'title' | 'description' | 'actionLabel' | 'onAction'>;
};

/**
 * Generic, column-driven table — .tbl in the kit (sortable headers,
 * row-select checkboxes, hover/selected rows, empty + skeleton states).
 * One implementation reused for students, transactions, exercises, or
 * anything else with rows and columns; screens only supply `columns`.
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  selectable = false,
  selectedKeys,
  onToggleRow,
  onToggleAll,
  sortKey,
  sortDirection = 'asc',
  onSort,
  loading = false,
  emptyState,
}: DataTableProps<T>) {
  const allSelected = selectable && data.length > 0 && data.every((row) => selectedKeys?.has(keyExtractor(row)));

  if (!loading && data.length === 0 && emptyState) {
    return (
      <View className="rounded-lg border border-line bg-surface">
        <EmptyState {...emptyState} />
      </View>
    );
  }

  return (
    <View className="overflow-hidden rounded-lg border border-line bg-surface">
      <View className="flex-row items-center border-b border-line px-3.5 py-2.5">
        {selectable && <Checkbox checked={allSelected} onChange={() => onToggleAll?.()} />}
        {columns.map((col) => (
          <Pressable
            key={col.key}
            disabled={!col.sortable}
            onPress={() => onSort?.(col.key)}
            style={{ flex: col.weight ?? 1 }}
            className={cn(
              'flex-row items-center gap-1 px-2',
              selectable && 'ml-1',
              col.align === 'right' && 'justify-end'
            )}
          >
            <Text className="font-semibold text-[11px] uppercase tracking-wide text-muted">{col.header}</Text>
            {col.sortable && (
              <Icon
                name={sortKey === col.key && sortDirection === 'desc' ? 'chevronDown' : 'sort'}
                size={12}
                color="#8d8d8d"
              />
            )}
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View className="gap-4 p-3.5">
          {[0, 1, 2].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <Skeleton width={36} height={36} radius={18} />
              <View className="flex-1 gap-1.5">
                <Skeleton width="45%" height={11} />
                <Skeleton width="30%" height={9} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        data.map((row, index) => {
          const key = keyExtractor(row);
          const selected = selectedKeys?.has(key);
          const isLast = index === data.length - 1;
          const Row = (
            <Fragment>
              {selectable && <Checkbox checked={!!selected} onChange={() => onToggleRow?.(key)} />}
              {columns.map((col) => (
                <View
                  key={col.key}
                  style={{ flex: col.weight ?? 1 }}
                  className={cn('px-2', selectable && 'ml-1', col.align === 'right' && 'items-end')}
                >
                  {col.render(row)}
                </View>
              ))}
            </Fragment>
          );

          return onRowPress ? (
            <Pressable
              key={key}
              onPress={() => onRowPress(row)}
              className={cn(
                'flex-row items-center px-3.5 py-2.5 active:bg-surface-2',
                !isLast && 'border-b border-line',
                selected && 'bg-primary-soft'
              )}
            >
              {Row}
            </Pressable>
          ) : (
            <View
              key={key}
              className={cn(
                'flex-row items-center px-3.5 py-2.5',
                !isLast && 'border-b border-line',
                selected && 'bg-primary-soft'
              )}
            >
              {Row}
            </View>
          );
        })
      )}
    </View>
  );
}
