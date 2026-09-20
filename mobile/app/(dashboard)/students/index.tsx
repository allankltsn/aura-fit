import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Avatar, Button, Chip, DataTable, Input, StatusBadge, type DataTableColumn } from '@/components/ui';
import { Pagination } from '@/components/navigation';
import { Icon } from '@/components/icons';
import { students as allStudents } from '@/lib/mockData';

type Student = (typeof allStudents)[number];

const filters = ['Todos', 'Ativos', 'Inativos'] as const;

export default function StudentsScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allStudents.filter((s) => {
      const matchesQuery = query.trim() === '' || s.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesFilter =
        filter === 'Todos' ||
        (filter === 'Ativos' && s.status === 'ok') ||
        (filter === 'Inativos' && s.status !== 'ok');
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const columns: DataTableColumn<Student>[] = [
    {
      key: 'name',
      header: 'Aluno',
      weight: 2.2,
      sortable: true,
      render: (s) => (
        <View className="flex-row items-center gap-2.5">
          <Avatar initials={s.initials} tone={s.tone} size={32} />
          <View>
            <Text className="font-semibold text-[13px] text-text">{s.name}</Text>
            <Text className="text-xs text-muted">{s.email}</Text>
          </View>
        </View>
      ),
    },
    { key: 'workout', header: 'Treino', render: (s) => <Text className="text-[13px] text-text">{s.workout}</Text> },
    {
      key: 'last',
      header: 'Último treino',
      render: (s) => <Text className="text-[13px] tabular-nums text-text">{s.last}</Text>,
    },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge label={s.statusLabel} tone={s.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      weight: 0.6,
      render: () => <Icon name="more" size={18} color="#666666" />,
    },
  ];

  return (
    <View className="flex-1 gap-4">
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <View>
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-h2 text-text">
            Gestão de Alunos
          </Text>
          <Text className="text-[13px] text-muted">Gerencie seus alunos e acompanhe a evolução.</Text>
        </View>
        <Button
          icon={<Icon name="plus" size={16} color="#ffffff" />}
          onPress={() => router.push('/(dashboard)/students/new')}
        >
          Adicionar aluno
        </Button>
      </View>

      <View className="gap-3">
        <Input
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={query}
          onChangeText={setQuery}
          leading={<Icon name="search" size={16} color="#8d8d8d" />}
        />
        <View className="flex-row flex-wrap gap-2">
          {filters.map((f) => (
            <Chip
              key={f}
              label={`${f} (${f === 'Todos' ? allStudents.length : allStudents.filter((s) => (f === 'Ativos' ? s.status === 'ok' : s.status !== 'ok')).length})`}
              selected={filter === f}
              onPress={() => setFilter(f)}
            />
          ))}
        </View>
      </View>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(s) => s.id}
        selectable
        selectedKeys={selected}
        onToggleRow={(id) =>
          setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return next;
          })
        }
        onToggleAll={() =>
          setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((s) => s.id))))
        }
        onRowPress={(s) => router.push(`/(dashboard)/students/${s.id}`)}
        emptyState={{
          icon: 'users',
          title: 'Nenhum aluno encontrado',
          description: 'Ajuste a busca ou adicione um novo aluno ao seu painel.',
          actionLabel: 'Adicionar aluno',
          onAction: () => router.push('/(dashboard)/students/new'),
        }}
      />

      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-muted">
          Mostrando {filtered.length} de {allStudents.length} alunos
        </Text>
        <Pagination page={page} pageCount={3} onChange={setPage} />
      </View>
    </View>
  );
}
