import test from 'ava';
import * as iots from 'io-ts';

import {reporter} from 'src';

test('reports an empty array when the result doesn’t contain errors', (t) => {
	const PrimitiveType = iots.string;
	const result = PrimitiveType.decode('');

	t.deepEqual(reporter.report(result), []);
});

test('formats a top-level primitve type correctly', (t) => {
	const PrimitiveType = iots.string;
	const result = PrimitiveType.decode(42);

	t.deepEqual(reporter.report(result), [
		'Expecting value of type string but instead got value: 42'
	]);
});

test('formats array items', (t) => {
	const NumberGroups = iots.array(iots.array(iots.number));
	const result = NumberGroups.decode({});

	t.deepEqual(reporter.report(result), [
		'Expecting value of type Array<Array<number>> but instead got value: {}'
	]);
});

test('formats nested array item mismatches correctly', (t) => {
	const NumberGroups = iots.array(iots.array(iots.number));
	const result = NumberGroups.decode([[{}]]);

	t.deepEqual(reporter.report(result), [
		'Expecting value of type number at path "0.0" but instead got value: {}'
	]);
});

test('formats a complex type correctly', (t) => {
	const Gender = iots.union([iots.literal('Male'), iots.literal('Female')]);
	const Person = iots.interface({
		name: iots.string,
		age: iots.number,
		gender: Gender,
		children: iots.array(
			iots.interface({
				gender: Gender
			})
		)
	});
	const result = Person.decode({
		name: 'Giulio',
		children: [{gender: 'Whatever'}]
	});

	t.deepEqual(reporter.report(result), [
		'Expecting value of type number at path "age" but instead got value: undefined',
		'Expecting value of type "Male" at path "gender.0" but instead got value: undefined',
		'Expecting value of type "Female" at path "gender.1" but instead got value: undefined',
		'Expecting value of type "Male" at path "children.0.gender.0" but instead got value: "Whatever"',
		'Expecting value of type "Female" at path "children.0.gender.1" but instead got value: "Whatever"'
	]);
});
