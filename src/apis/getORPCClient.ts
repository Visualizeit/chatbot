import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";

import router from "@/apis/router";

const getORPCClient = createIsomorphicFn()
  .server(() => createRouterClient(router))
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api`,
    });

    return createORPCClient(link);
  });

export default getORPCClient;
