import test from 'ava';
import * as iots from 'io-ts';

import reporter from 'src';

test('it handles wrong value type for interface', t => {
	const codec = iots.interface({a: iots.string});
	const report = reporter.report(codec.decode({a: 5}));
	t.deepEqual(report, ['a: something was wrong']);
});
test('it decodes', t => {
	const codec = iots.interface({a: iots.string, b: iots.interface({b1: iots.number})});
	t.is(reporter.report(codec.decode({a: 5, b: {b1: 'yo'}})), ['hi']);
});
