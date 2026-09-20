import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui';
import { Icon } from '@/components/icons';
import { chatMessages, trainer } from '@/lib/mockData';
import { cn } from '@/lib/cn';

export default function ChatScreen() {
  const [draft, setDraft] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center gap-2.5 border-b border-line px-3 py-2.5">
        <Avatar initials={trainer.initials} tone={3} size={32} presence="online" />
        <View>
          <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[15px] text-text">
            Chat com o Personal
          </Text>
          <Text className="text-[11px] text-muted">
            {trainer.name} · <Text className="text-success">online</Text>
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1" keyboardVerticalOffset={90}>
        <ScrollView contentContainerClassName="gap-2.5 px-3 py-3">
          {chatMessages.map((m) => (
            <View
              key={m.id}
              className={cn(
                'max-w-[82%] rounded-2xl px-3 py-2.5',
                m.from === 'me' ? 'self-end rounded-br-md bg-primary' : 'self-start rounded-bl-md bg-surface-2'
              )}
            >
              <Text className={cn('text-[12.5px] leading-[17px]', m.from === 'me' ? 'text-white' : 'text-text')}>{m.text}</Text>
              <Text className={cn('mt-1 text-right text-[10px] opacity-70', m.from === 'me' ? 'text-white' : 'text-muted')}>
                {m.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="flex-row items-center gap-2 px-3 pb-3">
          <View className="h-10 flex-1 flex-row items-center rounded-full border border-line-strong bg-surface px-4">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#8d8d8d"
              className="flex-1 text-sm text-text"
              style={{ fontFamily: 'Inter_400Regular' }}
            />
          </View>
          <Pressable
            accessibilityLabel="Enviar"
            onPress={() => setDraft('')}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary active:bg-primary-press"
          >
            <Icon name="send" size={16} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
