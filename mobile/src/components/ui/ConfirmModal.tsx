import { Modal, Text, View } from 'react-native';
import { Button } from './Button';
import { Icon, type IconName } from '@/components/icons';

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  description: string;
  icon?: IconName;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation dialog — .modal + .scrim in the kit, max width 400, darkened backdrop. */
export function ConfirmModal({
  visible,
  title,
  description,
  icon = 'trash',
  confirmLabel = 'Remover',
  cancelLabel = 'Cancelar',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-dark/55 px-6">
        <View className="w-full max-w-[400px] gap-4 rounded-xl bg-surface p-6 shadow-xl">
          <View className="h-11 w-11 items-center justify-center rounded-md bg-primary-soft">
            <Icon name={icon} size={24} color="#b1111b" />
          </View>
          <View className="gap-1.5">
            <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-xl text-text">
              {title}
            </Text>
            <Text className="text-sm text-muted">{description}</Text>
          </View>
          <View className="flex-row flex-wrap justify-end gap-2">
            <Button variant="ghost" onPress={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={destructive ? 'primary' : 'secondary'} onPress={onConfirm}>
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
