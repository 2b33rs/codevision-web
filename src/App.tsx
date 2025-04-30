import { router } from "@/navigation/router.tsx";
import { RouterProvider } from "react-router";
import { store } from "@/api/store.ts";
import { Provider } from "react-redux";
import { ErrorBoundary } from "@/navigation/ErrorBoundary.tsx";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Verkauf & Versand | YourShirt GmbH";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Übersicht Verkauf und Versand");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Übersicht Verkauf und Versand";
      document.head.appendChild(meta);
    }
  });
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
