import { Button, DataTable, StatusBadge, type DataTableColumn } from '@/components/ui';
import { Text, View } from 'react-native';
import { Icon } from '@/components/icons';
import { permissionRoles } from '@/lib/mockData';

type Role = (typeof permissionRoles)[number];

const columns: DataTableColumn<Role>[] = [
  {
    key: 'name',
    header: 'Papel',
    weight: 1.4,
    render: (r) => <Text className="font-semibold text-[13px] text-text">{r.name}</Text>,
  },
  {
    key: 'description',
    header: 'Descrição',
    weight: 2.4,
    render: (r) => <Text className="text-[13px] text-muted">{r.description}</Text>,
  },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge label="Ativo" tone={r.status} /> },
];

/**
 * Read-only view of the app's roles — this is a mockup, not a real
 * permission editor. Actual role/permission changes are an authorization
 * change and need to go through the backend (and, per this repo's
 * CLAUDE.md, human approval for IAM-adjacent changes), not a client-side
 * toggle.
 */
export default function PermissionsScreen() {
  return (
    <View className="flex-1 gap-5">
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <View>
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
            Gerenciamento de Permissões
          </Text>
          <Text className="text-[13px] text-muted">Papéis disponíveis e o nível de acesso de cada um.</Text>
        </View>
        <Button icon={<Icon name="plus" size={16} color="#ffffff" />}>Nova função</Button>
      </View>

      <DataTable columns={columns} data={permissionRoles} keyExtractor={(r) => r.id} />
    </View>
  );
}
