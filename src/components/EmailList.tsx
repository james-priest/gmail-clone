import React, { useEffect } from 'react'
import { Table } from 'antd'
import { connect } from 'react-redux'

import SectionSpin from './SectionSpin'
// import EmptyArea from './EmptyArea'
import ActionButtons from './ActionButtons'

import { fetchFolderMessages } from '../actions/folderMessagesActions'

import type * as type from '../types/Gmail'
import { fetchMessage } from '../actions/messageActions'

interface EmailListProps {
  dispatch: any
  loading: boolean
  folderMessages: type.FolderMessage[]
  hasErrors: boolean
  setMessageId: any
}

const EmailList: React.FC<EmailListProps> = ({
  dispatch,
  loading,
  folderMessages,
  hasErrors,
  setMessageId,
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'from',
      key: 'from',
      render: (text: string) => <a href="#a">{text}</a>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: type.FolderMessage) => <ActionButtons record={record} />,
    },
  ]

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: type.FolderMessage[]
    ) => {
      console.log(`selectedRows`, selectedRows)
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
    },
    getCheckboxProps: (record: type.FolderMessage) => ({
      disabled: record.from === 'Disabled User', // Column configuration not to be checked
      name: record.from,
    }),
  }

  useEffect(() => {
    dispatch(fetchFolderMessages('Inbox'))
  }, [dispatch])

  const renderPage = () => {
    // if (loading) return <Spin className="email-list-section" />
    if (loading) return <SectionSpin className="email-list-section" />
    // if (hasErrors)
    //   return (
    //     <EmptyArea
    //       message="No messages in this folder."
    //       className="email-list-section"
    //     />
    //   )
    if (hasErrors) return <p>Mock network error. Unable to display mail</p>
    return (
      <Table
        className="email-list-section"
        columns={columns}
        dataSource={Object.values(folderMessages)}
        pagination={false}
        onRow={(record) => ({
          onClick: () => {
            console.log(
              `Email click: ${record['message-id']} - ${record.subject}`
            )
            // dispatch(fetchMessage(record['message-id']))
            setMessageId(record['message-id'])
          },
        })}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    )
  }

  renderPage()

  return <>{renderPage()}</>
}

const mapStateToProps = (state: type.folderMessagesState) => {
  return {
    loading: state.folderMessages.loading,
    folderMessages: state.folderMessages.folderMessages,
    hasErrors: state.folderMessages.hasErrors,
  }
}

export default connect(mapStateToProps)(EmailList)
