import { Pressable, Text, View } from 'react-native';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/cn';

export type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

/** .pg in the kit — numbered pager with prev/next chevrons. */
export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <View className="flex-row items-center gap-1">
      <Pressable
        accessibilityLabel="Anterior"
        disabled={page <= 1}
        onPress={() => onChange(page - 1)}
        className="h-8 min-w-8 items-center justify-center rounded-sm active:bg-surface-2 disabled:opacity-40"
      >
        <Icon name="back" size={16} color="#666666" />
      </Pressable>
      {pages.map((p) => (
        <Pressable
          key={p}
          onPress={() => onChange(p)}
          className={cn('h-8 min-w-8 items-center justify-center rounded-sm px-1', p === page ? 'bg-primary' : 'active:bg-surface-2')}
        >
          <Text className={cn('text-[13px] font-medium', p === page ? 'text-white' : 'text-muted')}>{p}</Text>
        </Pressable>
      ))}
      <Pressable
        accessibilityLabel="Próxima"
        disabled={page >= pageCount}
        onPress={() => onChange(page + 1)}
        className="h-8 min-w-8 items-center justify-center rounded-sm active:bg-surface-2 disabled:opacity-40"
      >
        <Icon name="chevronRight" size={16} color="#666666" />
      </Pressable>
    </View>
  );
}
