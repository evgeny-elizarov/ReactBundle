import React from 'react';
import { autobind } from "@AndevisReactBundle/decorators";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import ReactTable from 'react-table';
import selectTableHOC from 'react-table/lib/hoc/selectTable';
import treeTableHOC from 'react-table/lib/hoc/treeTable';
import messages from './messages';
import 'react-table/react-table.css';
import './DataTable.scss';
import { i18nWrapper } from './helpers';

const TreeTable = i18nWrapper(treeTableHOC(ReactTable));

export default TreeTable;