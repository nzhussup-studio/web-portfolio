import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const architecturePlugin = {
  rules: {
    'enforce-import-boundaries': {
      meta: {
        type: 'problem',
        schema: [],
        messages: {
          parentRelative: 'Import across a folder boundary through "{{source}}" is not allowed. Use an @/ entry point instead.',
          privateComponent: 'Import components through their folder entry point, not "{{source}}".',
          privateApi: 'Import API code through @/api or @/api/queries, not "{{source}}".',
        },
      },
      create(context) {
        const checkSource = (node) => {
          const source = node.source?.value
          if (typeof source !== 'string') return

          if (source === '..' || source.startsWith('../')) {
            context.report({ node: node.source, messageId: 'parentRelative', data: { source } })
            return
          }

          if (source.startsWith('@/components/') && source.split('/').length > 4) {
            context.report({ node: node.source, messageId: 'privateComponent', data: { source } })
          }

          if (source.startsWith('@/api/') && source !== '@/api/queries') {
            context.report({ node: node.source, messageId: 'privateApi', data: { source } })
          }
        }

        return {
          ImportDeclaration: checkSource,
          ExportAllDeclaration: checkSource,
          ExportNamedDeclaration: checkSource,
          ImportExpression: checkSource,
        }
      },
    },
  },
}

export default [
  {
    ignores: ['dist', 'src/api/generated'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      architecture: architecturePlugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      architecture: architecturePlugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'architecture/enforce-import-boundaries': 'error',
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
