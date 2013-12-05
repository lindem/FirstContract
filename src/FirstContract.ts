/**
 * Created on 12/2/13.
 *
 * (c) 2013 Sol Venetus Software GmbH, Germany
 * <timo.lindemann@sol-venetus.de>
 *
 * This software s provided under the MIT license. See the file LICENSE.TXT for
 * details.
 */

// The following line is needed for the typescript compiler. If you build this,
// you should change this to something appropriate.
///<reference path="./definitions/node.d.ts" />

import _ArrayContracts = require("./ArrayContracts");
import _BasicContracts = require("./BasicContracts");
import _DateContracts = require("./DateContracts");
import _NumberContracts = require("./NumberContracts");
import _ObjectContracts = require("./ObjectContracts");
import _StringContracts = require("./StringContracts");
import _TypeContracts = require("./TypeContracts");

import _Wrappers = require("./Wrappers");
import _Common = require("./Common");

// The last versions of this had this interface, so it's preserved.
export module Contracts {
    export var ArrayContracts = _ArrayContracts;
    export var BasicContracts = _BasicContracts;
    export var DateContracts = _DateContracts;
    export var NumberContracts = _NumberContracts;
    export var ObjectContracts = _ObjectContracts;
    export var StringContracts = _StringContracts;
    export var TypeContracts = _TypeContracts;
    export var byAlias = _Common.byAlias;
    export var Wrappers = _Wrappers;
}

export var c = _Wrappers.c;
export var contractify = _Wrappers.contractify;