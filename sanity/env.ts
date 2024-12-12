export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28';

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID'
);

/**
 * Function to assert the presence of a required environment variable.
 * Logs the issue if missing and provides an informative error message.
 */
function assertValue<T>(value: T | undefined, varName: string): T {
  if (typeof value === 'undefined' || value === null || value === '') {
    console.error(`Environment variable ${varName} is missing or empty.`);
    throw new Error(`Missing environment variable: ${varName}`);
  }

  console.log(`${varName} is set to:`, value); // Optional: Remove this in production
  return value;
}



// export const apiVersion =
//   process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28'

// export const dataset = assertValue(
//   process.env.NEXT_PUBLIC_SANITY_DATASET,
//   'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
// )

// export const projectId = assertValue(
//   process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
// )

// function assertValue<T>(v: T | undefined, errorMessage: string): T {
//   if (v === undefined) {
//     throw new Error(errorMessage)
//   }

//   return v
// }
