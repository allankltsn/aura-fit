import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { Icon } from '@/components/icons';

export type BreadcrumbProps = { items: string[] };

/** .crumb in the kit — last item bold, chevron separators. */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <View className="flex-row flex-wrap items-center gap-1.5">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={item}>
            <Text className={last ? 'font-semibold text-[13px] text-text' : 'text-[13px] text-muted'}>{item}</Text>
            {!last && <Icon name="chevronRight" size={14} color="#666666" />}
          </Fragment>
        );
      })}
    </View>
  );
}
