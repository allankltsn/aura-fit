import { Redirect } from 'expo-router';

/** No auth wired yet — the login screen is the app's entry point. */
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
