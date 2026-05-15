import React from 'react'
import { PrimaryButton } from '../../Components/CustomComponents/ButtonUi'

const ImportExport = () => {
  return (
    <>
    <div>
      <h1 className="text-black font-semibold text-lg">
            Import
          </h1>
    </div>
    <div className='flex justify-evenly mb-6 mt-3'>
        <PrimaryButton
        title={"Upload"}
        />
        <PrimaryButton
        title={"Download Sample File"}
        />
    </div>
    <div>
        <PrimaryButton
        title={"Submit"}
        type={"primary"}
        />
    </div>

    <div className='mt-5 mb-5'>
      <h1 className="text-black font-semibold text-lg">
            Export
          </h1>
    </div>
    <div>
        <PrimaryButton
        title={"Export/Download"}
        type={"primary"}
        />
    </div>
    </>
  )
}

export default ImportExport
