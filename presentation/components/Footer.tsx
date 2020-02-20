import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { StyledFooter, StyledFooterContent } from './Footer.styled'

export const Footer: React.FC = () => {
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  return (
    <StyledFooter>
      <StyledFooterContent>
        <h5 style={{ margin: '0px' }}>Grayskull Authentication Server v{process.env.PRODUCT_VERSION}</h5>
        <Button onClick={toggle} color="link">
          Release Notes
        </Button>
      </StyledFooterContent>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Version Release Notes</ModalHeader>
        <ModalBody>
          <div style={{ height: '50vh', width: '100%', overflow: 'auto', position: 'relative' }}>
            <iframe
              src="/releaseNotes.html"
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                height: '50vh',
                width: '100%'
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </StyledFooter>
  )
}
