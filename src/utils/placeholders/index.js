import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context';

export function TextWithPlaceholders({ children }) {
  const [text, setText] = useState(children);

  const context = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const placeholders = await Promise.all(
        [...text.matchAll(/{(.*?)}/g)].map(async (match) => {
          const key = match[1];
          let val = key;
          try {
            const placeholdersServiceEndpoint =
            `${context.placeholdersExtensionURL}/values`;
            const resp = await fetch(
              `${placeholdersServiceEndpoint}?placeholder=${key}`
            );
            if (!resp.ok) {
              throw new Error('Placeholder service failure');
            }
            val = (await resp.json()).data;
          } catch (err) {
            console.error(
              `Failed to fetch value for placeholder "${key}": ${err.message}`
            );
          }
          return { key, val };
        })
      );

      let processedText = text;
      placeholders.forEach(
        (placeholder) => {
          processedText = processedText.replace(
            `{${placeholder.key}}`,
            placeholder.val
          );
        },
        [setText]
      );
      setText(processedText);
    })();
  }, [context.placeholdersExtensionURL, text]);

  return text;
}
