import React, { useState } from 'react'
import axios from 'axios' // Import Axios
import CustomButton from '../../components/CustomButton'
import { DropzoneAreaBase } from 'material-ui-dropzone'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useAlert from '../../contexts/AlertContext/useAlert'

const AddRecordModal = ({ handleClose, handleUpload, patientAddress }) => {
  const { setAlert } = useAlert()
  const [file, setFile] = useState(null)
  const [IPFShash, setIPFShash] = useState(null)

  const handleFileChange = async fileObj => {
    console.log('File selected:', fileObj)
    const formData = new FormData()
    formData.append('file', fileObj.file)
    console.log('formData :>> ', formData)
    setFile(fileObj.file)
    try {
      const resFile = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
          pinata_api_key: `052e62f05113505d50fe`,
          pinata_secret_api_key: `4b93c6819c2e1c5aefe738093b295168e04294606f10675f5e26ff8d21f3c098`,
          'Content-Type': 'multipart/form-data',
        },
      })

      const IPFShash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`
      setIPFShash(IPFShash)

      console.log('IPFS Hash:', IPFShash)
    } catch (error) {
      console.log('error :>> ', error)

      console.error('Error during file upload:', error)
    }
    setFile(fileObj.file)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        weight: '100vw',
      }}
    >
      <Box
        width='50vw'
        style={{
          backgroundColor: 'white',
          boxShadow: 24,
          borderRadius: 10,
        }}
        p={2}
        pr={6}
        pb={0}
        position='relative'
      >
        <Box position='absolute' sx={{ top: 5, right: 5 }}>
          <IconButton onClick={() => handleClose()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display='flex' flexDirection='column' my={1}>
          <Typography variant='h4'>Add Record</Typography>
          <Box my={2}>
            <DropzoneAreaBase
              onAdd={fileObjs => handleFileChange(fileObjs[0])}
              onDelete={fileObj => {
                setFile(null)
              }}
              onAlert={(message, variant) => setAlert(message, variant)}
            />
          </Box>
          <Box display='flex' justifyContent='space-between' mb={2}>
            {file && <Chip label={file.name} onDelete={() => setFile(null)} style={{ fontSize: '12px' }} />}
            <Box flexGrow={1} />
            <CustomButton
              text='upload'
              handleClick={() => handleUpload(IPFShash, file.name, patientAddress)}
              disabled={!file || !IPFShash}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddRecordModal
