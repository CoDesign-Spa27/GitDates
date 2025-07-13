export const apps = [
  {
    name: 'gitdates',
    script: 'npm',
    args: 'run start',
    env: {
      NODE_OPTIONS: '--max-old-space-size=512',
      GENERATE_SOURCEMAP: 'false',
    },
  },
]
