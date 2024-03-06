import {cn as bem} from '@bem-react/classname'
import { ChangeEvent, useCallback, KeyboardEvent, ClipboardEvent, useRef, useMemo, useState, useEffect, useLayoutEffect } from 'react'
import './style.css'
import DOMPurify from 'dompurify'

type Props = {
  inputPlaceholder: string
  sendLabel: string
  value: string
  onChange:  (text: string) => void
  onSubmit: () => void
}

function ChatMessageCreatorLayout(props: Props) {
  const cn = bem('ChatMessageCreatorLayout')
  const textareaRef = useRef<HTMLDivElement>(null)

  const callbacks = {
    onKeyDown: useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        props.onSubmit()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selection = window.getSelection();
        console.log(selection)
        if (!selection?.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode('\n '));
        selection.collapseToEnd();
        if (!textareaRef.current) return
        props.onChange(textareaRef.current.innerHTML || '')
        textareaRef.current.scrollIntoView()
      }
    }, [props.onSubmit, props.onChange]),

    onInput: useCallback((e: ChangeEvent<HTMLDivElement>) => {
      const text = DOMPurify.sanitize(e.target.innerHTML, {
        ALLOWED_TAGS: ['b', 'i'],
        ALLOWED_ATTR: [],
      })
      props.onChange(text)
    }, [props.onChange]),

    onPaste: useCallback((e: ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      let preventPaste = false
      let clipboardData = e.clipboardData;
      if (clipboardData) {
        let items = clipboardData.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              preventPaste = true
              break;
            }
          }
        }
      }
      if (!preventPaste) {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        selection.deleteFromDocument();
        const text = clipboardData.getData('text')
        const html = DOMPurify.sanitize(text, {
          ALLOWED_TAGS: ['b', 'i', 'a'],
          ALLOWED_ATTR: ['href'],
        })
        console.log(text)
        selection.getRangeAt(0).insertNode(document.createTextNode(html));
        selection.collapseToEnd();
      }
      props.onChange(textareaRef.current?.innerHTML || '')
    }, [props.onChange])
  }

  useLayoutEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = "20px";
    textareaRef.current.style.height = (textareaRef.current.scrollHeight) + "px";
  }, [props.value])

  
  useEffect(() => {
   if (props.value === '' && textareaRef.current) {
      textareaRef.current.innerHTML = props.value
   }
  }, [props.value])

  return (
    <form className={cn()}>
      <div className={cn('textarea')}
                contentEditable={true}
                ref={textareaRef}
                onInput={callbacks.onInput}
                onKeyDown={callbacks.onKeyDown}
                onPaste={callbacks.onPaste}
        />   
    </form>
  )
}

export default ChatMessageCreatorLayout