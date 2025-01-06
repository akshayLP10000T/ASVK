import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "./context/user.context";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
