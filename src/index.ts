import * as alfy from 'alfy';
import { list } from './utils';

alfy.output(list().map(c => ({
		title: c.name,
		subtitle: 'Status: ' + c.status,
		arg: c.name
})));
