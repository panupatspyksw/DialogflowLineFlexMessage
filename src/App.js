import { useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'

function App() {
  const lineJSON = useRef({})
  const DialogflowJSON = useRef('')
  const SimulatorJSON = useRef('')
  const ConvertFlexMessage = (e) => {
    try {
      DialogflowJSON.current.value = ''
      let jsonval = JSON.parse(lineJSON.current.value)
      if (jsonval.line) {
        throw new Error(
          'Please do not add additional property in JSON from FLEX MESSAGE SIMULATOR'
        )
      } else if (jsonval.type !== 'bubble' && jsonval.type !== 'carousel') {
        throw new Error('Support Flex Message types bubble and carousel only.')
      }
      let cleanJsonRegex = filterObject(jsonval, 'flex')
      SimulatorJSON.current = JSON.stringify(cleanJsonRegex)
      cleanJsonRegex = {
        line: {
          altText: 'Flex message',
          type: 'flex',
          contents: { ...cleanJsonRegex },
        },
      }

      DialogflowJSON.current.value = JSON.stringify(cleanJsonRegex)
      toast.success('Convert Successful')

      // console.log(JSON.stringify(cleanJsonRegex))
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.warning('JSON format invalid')
      } else {
        toast.warning(err.message)
      }
    }
  }

  function filterObject(obj, key) {
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue
      if (i === key) {
        delete obj[key]
      } else if (typeof obj[i] === 'object') {
        filterObject(obj[i], key)
      }
    }
    return obj
  }

  function CopyToclipboard(data) {
    toast.success('Copy to clipboard successful')
    navigator.clipboard.writeText(data)
  }

  return (
    <>
      <ToastContainer />
      <div className='bg-black p-3 text-white'>
        FLEX MESSAGE SIMULATOR CONVERT FOR DAILOGFLOW [DEMO]
        <div>
          (FOR USE COPY JSON FROM{' '}
          <a
            className='text-blue-400'
            target={'_blank'}
            href='https://developers.line.biz/flex-simulator/'
            rel='noreferrer'
          >
            FLEX MESSAGE SIMULATOR
          </a>
          )
        </div>
      </div>
      <div className='flex flex-col md:flex-row gap-5 p-5'>
        <div className='w-full'>
          <h3 className='font-bold text-lg mb-3'>
            JSON FROM FLEX MESSAGE SIMULATOR
          </h3>
          <textarea
            className='border-2	w-full h-full'
            cols='30'
            rows='10'
            maxLength={50000}
            ref={lineJSON}
          ></textarea>
          <button
            className='hover:bg-blue-700 mt-3 w-full rounded-lg border-3 p-3 bg-blue-600 text-white font-bold'
            onClick={ConvertFlexMessage}
          >
            CONVERT
          </button>
        </div>
        <div className='w-full'>
          <h3 className='font-bold text-lg mb-3'>JSON FOR DIALOGFLOW</h3>
          <textarea
            className='border-2	w-full h-full '
            ref={DialogflowJSON}
            cols='30'
            rows='10'
          ></textarea>
          <button
            className='hover:bg-green-700 mt-3 w-full rounded-lg border-3 p-3 bg-green-600 text-white font-bold'
            onClick={() => {
              CopyToclipboard(DialogflowJSON.current.value)
            }}
          >
            COPY FOR DIALOGFLOW
          </button>
          <button
            className='hover:bg-green-700 mt-3 w-full rounded-lg border-3 p-3 bg-green-600 text-white font-bold disable'
            onClick={() => {
              CopyToclipboard(SimulatorJSON.current)
            }}
          >
            COPY FOR TEST IN FLEX MESSAGE SIMULATOR
          </button>
        </div>
      </div>
    </>
  )
}

export default App
