import { Hono } from "hono";
import { App, ButtonGroup } from "./components";

const app = new Hono();
app.get(`/`, (c) => {
  return c.render(
    <App pageTitle="Hono-JSX">
      <ButtonGroup path=""></ButtonGroup>
    </App>
  );
});

export default app;
