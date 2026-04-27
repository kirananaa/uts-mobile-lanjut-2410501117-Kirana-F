import { createStackNavigator } from "@react-navigation/stack";

import DetailScreen from "../screens/DetailScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "MovieDex" }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        // Judul header otomatis dari nama show yang dikirim via params
        options={({ route }) => ({
          title: route?.params?.show?.name || "Detail",
        })}
      />
    </Stack.Navigator>
  );
}
