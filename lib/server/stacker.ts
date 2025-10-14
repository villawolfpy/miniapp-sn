interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export class StackerNewsError extends Error {}

export async function executeStackerQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const apiUrl = process.env.SN_API_URL;

  if (!apiUrl) {
    throw new StackerNewsError('SN_API_URL is not configured');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (process.env.SN_API_KEY) {
    headers.Authorization = `Bearer ${process.env.SN_API_KEY}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new StackerNewsError(
      `Stacker News request failed (${response.status}): ${errorText}`
    );
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    const message = payload.errors.map((err) => err.message).join('\n');
    throw new StackerNewsError(message);
  }

  if (!payload.data) {
    throw new StackerNewsError('Stacker News response did not include data');
  }

  return payload.data;
}
