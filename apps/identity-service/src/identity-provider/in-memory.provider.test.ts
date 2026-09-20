import { runProviderContract } from './provider.contract';
import { InMemoryIdentityProvider } from './in-memory.provider';

runProviderContract('InMemory', async () => new InMemoryIdentityProvider());
