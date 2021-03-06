// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// 'License'); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
define([
  'knockout',
  'desktop/js/autocomplete/sql',
  'desktop/spec/autocompleterTestUtils'
], function(ko, sql, testUtils) {

  describe('sql.js UPDATE statements', function() {

    beforeAll(function () {
      sql.yy.parseError = function (msg) {
        throw Error(msg);
      };
      jasmine.addMatchers(testUtils.testDefinitionMatcher);
    });

    var assertAutoComplete = testUtils.assertAutocomplete;

    it('should suggest keywords for "|"', function() {
      assertAutoComplete({
        beforeCursor: '',
        afterCursor: '',
        containsKeywords: ['UPDATE'],
        expectedResult: {
          lowerCase: false
        }
      });
    });

    it('should suggest keywords for "UPDATE bar  |"', function () {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar  ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestKeywords: ['SET'],
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 8, last_column: 11}, identifierChain: [{ name: 'bar'}]}
          ]
        }
      });
    });

    it('should suggest keywords for "UPDATE bar SET id=1, foo=2 |"', function () {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar SET id=1, foo=2 ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestKeywords: ['WHERE'],
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 8, last_column: 11}, identifierChain: [{ name: 'bar'}]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 16, last_column: 18}, identifierChain: [{ name: 'bar'}, { name: 'id' }]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 22, last_column: 25}, identifierChain: [{ name: 'bar'}, { name: 'foo' }]}
          ]
        }
      });
    });

    it('should suggest keywords for "UPDATE bar SET id |"', function () {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar SET id ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestKeywords: ['='],
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 8, last_column: 11}, identifierChain: [{ name: 'bar'}]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 16, last_column: 18}, identifierChain: [{ name: 'bar'}, { name: 'id' }]}
          ]
        }
      });
    });

    it('should suggest tables for "UPDATE |"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestTables: {},
          suggestDatabases: {
            appendDot: true
          }
        }
      });
    });

    it('should suggest tables for "UPDATE bla|"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bla',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestTables: {},
          suggestDatabases: {
            appendDot: true
          }
        }
      });
    });

    it('should suggest tables for "UPDATE bar.|"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestTables: { identifierChain: [{ name: 'bar' }] }
        }
      });
    });

    it('should suggest tables for "UPDATE bar.foo|"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.foo',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestTables: { identifierChain: [{ name: 'bar' }] }
        }
      });
    });

    it('should suggest columns for "UPDATE bar.foo SET |"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.foo SET ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestColumns: { tables: [{ identifierChain: [{ name: 'bar'}, { name: 'foo' }] }] },
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 12, last_column: 15}, identifierChain: [{ name: 'bar'}, { name: 'foo' }]}
          ]
        }
      });
    });

    it('should suggest columns for "UPDATE bar.foo SET id = 1, bla = \'foo\', |"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.foo SET id = 1, bla = \'foo\', ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestColumns: { tables: [{ identifierChain: [{ name: 'bar'}, { name: 'foo' }] }] },
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 12, last_column: 15}, identifierChain: [{ name: 'bar'}, { name: 'foo' }]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 20, last_column: 22}, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'id' }]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 28, last_column: 31}, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'bla' }]}
          ]
        }
      });
    });

    it('should suggest columns for "UPDATE bar.foo SET bla = \'foo\' WHERE |"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.foo SET bla = \'foo\' WHERE ',
        afterCursor: '',
        expectedResult: {
          lowerCase: false,
          suggestFunctions: {},
          suggestColumns: { tables: [{ identifierChain: [{ name: 'bar'}, { name: 'foo' }] }] },
          suggestKeywords: ['EXISTS', 'NOT EXISTS'],
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 12, last_column: 15}, identifierChain: [{ name: 'bar'}, { name: 'foo' }]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 20, last_column: 23}, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'bla' }]}
          ]
        }
      });
    });

    it('should suggest values for "UPDATE bar.foo SET bla = \'foo\' WHERE id = |"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.foo SET bla = \'foo\' WHERE id = ',
        afterCursor: '',
        containsKeywords: ['CASE'],
        expectedResult: {
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 12, last_column: 15 }, identifierChain: [{ name: 'bar'}, { name: 'foo' }]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 20, last_column: 23 }, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'bla'}]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 38, last_column: 40 }, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'id'}]}
          ],
          suggestFunctions: { types: ['COLREF'] },
          suggestValues: true,
          colRef: { identifierChain: [{ name: 'bar' }, { name: 'foo' }, { name: 'id' }] },
          suggestColumns: { types: ['COLREF'], tables: [{ identifierChain: [{ name: 'bar'}, { name: 'foo' }] }] },
          lowerCase: false
        }
      });
    });



    it('should suggest columns for "UPDATE bar.foo SET bla = \'foo\' WHERE id = 1 AND |"', function() {
      assertAutoComplete({
        beforeCursor: 'UPDATE bar.foo SET bla = \'foo\' WHERE id = 1 AND ',
        afterCursor: '',
        containsKeywords: ['CASE'],
        expectedResult: {
          lowerCase: false,
          suggestFunctions: {},
          suggestColumns: { tables: [{ identifierChain: [{ name: 'bar'}, { name: 'foo' }] }] },
          locations: [
            {type: 'table', location: { first_line: 1, last_line: 1, first_column: 12, last_column: 15 }, identifierChain: [{ name: 'bar'}, { name: 'foo' }]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 20, last_column: 23 }, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'bla'}]},
            {type: 'column', location: { first_line: 1, last_line: 1, first_column: 38, last_column: 40 }, identifierChain: [{ name: 'bar'}, { name: 'foo' }, { name: 'id'}]}
          ]
        }
      });
    });
  });
});