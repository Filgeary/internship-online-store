import React, {
  useState,
  ChangeEvent,
  useLayoutEffect,
  useCallback,
  memo,
  useEffect,
} from "react"
import debounce from "lodash.debounce"
import { cn as bem } from "@bem-react/classname"
import Picker from "emoji-picker-react"
import Img from "../../../assets/images/smail.png"
import "./style.css"

interface IProps {
  value: string
  placeholder: string
  isBold: boolean
  addMessage: (value: string, name?: string | undefined) => void
  adjustTextareaHeight: () => void

}

const Textarea = React.forwardRef<HTMLTextAreaElement, IProps>(
  ({ placeholder, value, isBold, addMessage, adjustTextareaHeight }, ref) => {
    const cn = bem("Textarea")

    const [message, setMessage] = useState<string>(value)
    const [showPicker, setShowPicker] = useState(false)

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value)
      onChangeDebounce(event.target.value)
      adjustTextareaHeight()
    };

    const onChangeDebounce = useCallback(
      debounce((value: string) => addMessage(value, "message"), 600),
      [addMessage, value]
    );

    const onEmojiClick = (emojiObject: any) => {
        console.log('emojiObject.emoji', emojiObject.emoji)
        setMessage(prev => prev + emojiObject.emoji)
        onChangeDebounce(message + emojiObject.emoji);
        setShowPicker(false)
      };

    useEffect(() => {
      showPicker && window.scrollTo(0,document.body.scrollHeight)
    }, [showPicker])

    useLayoutEffect(() => setMessage(value), [value])

    return (
      <>
      {showPicker && <Picker
          lazyLoadEmojis={true}
          onEmojiClick={onEmojiClick}
          autoFocusSearch={true} />
          }
        <img
          className={cn("emoji-icon")}
          src={Img}
          onClick={() => setShowPicker((val) => !val)}
        />
        <textarea
          className={cn({bold: isBold})}
          ref={ref}
          value={message}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </>
    )
  }
)

export default memo(Textarea)
