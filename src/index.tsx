import { Hono } from "hono";
import {
  App,
  ButtonGroup,
  CollectionCard,
  ReleaseCard,
  UserCard,
} from "./components";
import { ANIXART_HEADERS, getApiBase } from "./config";
import { tryCatchAPI } from "./tryCatch";
import {
  generateCollectionOpenGraphImage,
  generateProfileOpenGraphImage,
  generateReleaseOpenGraphImage,
} from "./utils.tsx";

function renderIndexPage(c: any) {
  return c.render(
    <App>
      <ButtonGroup></ButtonGroup>
    </App>
  );
}

const app = new Hono();
app.get(`/`, (c) => {
  return renderIndexPage(c);
});

app.get(`/profile/:id`, async (c) => {
  if (!c.req.param("id")) {
    return renderIndexPage(c);
  }

  // sourcery skip: combine-object-destructuring
  const { data: profileData, error: profileError } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/profile/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  const { data: profileBlog } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/channel/blog/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (profileError) {
    return renderIndexPage(c);
  }

  return c.render(
    <App
      pageTitle={`${profileData.profile.login} @ Anixart`}
      pageIcon={profileData.profile.avatar}
      openGraph={{
        url: c.req.url,
        description: profileData.profile.status,
        image: `${c.req.url}/opengraph`,
        imageWidth: 512,
        imageHeight: 512,
      }}
    >
      <div class="flex flex-col gap-8">
        <UserCard
          user={profileData.profile}
          blog={profileBlog ? profileBlog.channel : null}
        />
        <ButtonGroup type={`profile`} id={c.req.param("id")}></ButtonGroup>
      </div>
    </App>
  );
});

app.get(`/profile/:id/opengraph`, async (c) => {
  if (!c.req.param("id")) {
    return c.text("нет ID", 400);
  }

  // sourcery skip: combine-object-destructuring
  const { data: profileData, error: profileError } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/profile/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  const { data: profileBlog } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/channel/blog/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (profileError) {
    return c.text(profileError.message, 500);
  }

  return await generateProfileOpenGraphImage(
    profileData.profile,
    profileBlog ? profileBlog.channel : null
  );
});

app.get(`/release/:id`, async (c) => {
  if (!c.req.param("id")) {
    return renderIndexPage(c);
  }

  // sourcery skip: combine-object-destructuring
  const { data, error } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/release/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (error) {
    return renderIndexPage(c);
  }

  return c.render(
    <App
      pageTitle={`${
        data.release.title_ru || data.release.title_original
      } @ Anixart`}
      pageIcon={data.release.image}
      openGraph={{
        url: c.req.url,
        description: data.release.description,
        image: `${c.req.url}/opengraph`,
        imageWidth: 512,
        imageHeight: 640,
      }}
    >
      <div class="flex flex-col gap-8">
        <ReleaseCard release={data.release} />
        <ButtonGroup type={`release`} id={c.req.param("id")}></ButtonGroup>
      </div>
    </App>
  );
});

app.get(`/release/:id/opengraph`, async (c) => {
  if (!c.req.param("id")) {
    return c.text("нет ID", 400);
  }

  // sourcery skip: combine-object-destructuring
  const { data, error } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/release/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (error) {
    return c.text(error.message, 500);
  }

  return await generateReleaseOpenGraphImage(data.release);
});

app.get(`/collection/:id`, async (c) => {
  if (!c.req.param("id")) {
    return renderIndexPage(c);
  }

  // sourcery skip: combine-object-destructuring
  const { data: collectionData, error: collectionError } =
    await tryCatchAPI<any>(
      fetch(`${getApiBase(c)}/collection/${c.req.param("id")}`, {
        method: "GET",
        headers: ANIXART_HEADERS,
      })
    );

  if (collectionError) {
    return renderIndexPage(c);
  }

  const { data: releasesData } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/collection/${c.req.param("id")}/releases/0`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  return c.render(
    <App
      pageTitle={`${collectionData.collection.title} @ Anixart`}
      pageIcon={collectionData.collection.image}
      openGraph={{
        url: c.req.url,
        description: collectionData.collection.description,
        image: `${c.req.url}/opengraph`,
        imageWidth: 600,
        imageHeight: 530,
      }}
    >
      <div class="flex flex-col gap-8">
        <CollectionCard
          collection={collectionData.collection}
          releases={releasesData}
        />
        <ButtonGroup type={`collection`} id={c.req.param("id")}></ButtonGroup>
      </div>
    </App>
  );
});

app.get(`/collection/:id/opengraph`, async (c) => {
  if (!c.req.param("id")) {
    return c.text("нет ID", 400);
  }

  // sourcery skip: combine-object-destructuring
  const { data, error } = await tryCatchAPI<any>(
    fetch(`${getApiBase(c)}/collection/${c.req.param("id")}`, {
      method: "GET",
      headers: ANIXART_HEADERS,
    })
  );

  if (error) {
    return c.text(error.message, 500);
  }

  return await generateCollectionOpenGraphImage(data.collection);
});

export default app;
