// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), c = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, l = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, u = (n, r, o) => (o = n == null ? {} : e(i(n)), l(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), d = /* @__PURE__ */ "Object.Uint8Array.RegExp.Date.Error.Map.Set.WeakMap.WeakSet.ArrayBuffer.SharedArrayBuffer.DataView.Promise.URL.HTMLElement.Int8Array.Uint8ClampedArray.Int16Array.Uint16Array.Int32Array.Uint32Array.Float32Array.Float64Array.BigInt64Array.BigUint64Array.Tagged".split(".");
function f(e) {
	if (e === null) return "null";
	if (e === void 0) return "undefined";
	if (e === !0 || e === !1) return "boolean";
	let t = typeof e;
	return t === "string" || t === "number" || t === "bigint" || t === "symbol" ? t : t === "function" ? "Function" : Array.isArray(e) ? "Array" : e instanceof Uint8Array ? "Uint8Array" : e.constructor === Object ? "Object" : p(e) || "Object";
}
function p(e) {
	let t = Object.prototype.toString.call(e).slice(8, -1);
	if (d.includes(t)) return t;
}
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/token.js
var m = class {
	constructor(e, t, n) {
		this.major = e, this.majorEncoded = e << 5, this.name = t, this.terminal = n;
	}
	toString() {
		return `Type[${this.major}].${this.name}`;
	}
	compare(e) {
		return this.major < e.major ? -1 : +(this.major > e.major);
	}
	static equals(e, t) {
		return e === t || e.major === t.major && e.name === t.name;
	}
};
m.uint = new m(0, "uint", !0), m.negint = new m(1, "negint", !0), m.bytes = new m(2, "bytes", !0), m.string = new m(3, "string", !0), m.array = new m(4, "array", !1), m.map = new m(5, "map", !1), m.tag = new m(6, "tag", !1), m.float = new m(7, "float", !0), m.false = new m(7, "false", !0), m.true = new m(7, "true", !0), m.null = new m(7, "null", !0), m.undefined = new m(7, "undefined", !0), m.break = new m(7, "break", !0);
var h = class {
	constructor(e, t, n) {
		this.type = e, this.value = t, this.encodedLength = n, this.encodedBytes = void 0, this.byteValue = void 0;
	}
	toString() {
		return `Token[${this.type}].${this.value}`;
	}
}, g = globalThis.process && !globalThis.process.browser && globalThis.Buffer && typeof globalThis.Buffer.isBuffer == "function", ee = new TextEncoder();
function te(e) {
	return g && globalThis.Buffer.isBuffer(e);
}
function ne(e) {
	return e instanceof Uint8Array ? te(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e : Uint8Array.from(e);
}
var re = 24, ie = 200, ae = g ? (e) => e.length >= re ? globalThis.Buffer.from(e) : ue(e) : (e) => e.length >= ie ? ee.encode(e) : ue(e), _ = (e) => Uint8Array.from(e), oe = g ? (e, t, n) => te(e) ? new Uint8Array(e.subarray(t, n)) : e.slice(t, n) : (e, t, n) => e.slice(t, n), se = g ? (e, t) => (e = e.map((e) => e instanceof Uint8Array ? e : globalThis.Buffer.from(e)), ne(globalThis.Buffer.concat(e, t))) : (e, t) => {
	let n = new Uint8Array(t), r = 0;
	for (let t of e) r + t.length > n.length && (t = t.subarray(0, n.length - r)), n.set(t, r), r += t.length;
	return n;
}, ce = g ? (e) => globalThis.Buffer.allocUnsafe(e) : (e) => new Uint8Array(e);
function le(e, t) {
	if (te(e) && te(t)) return e.compare(t);
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return e[n] < t[n] ? -1 : 1;
	return 0;
}
function ue(e) {
	let t = [], n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e.charCodeAt(r);
		i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) == 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) == 56320 ? (i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (i >= 55296 && i <= 57343 && (i = 65533), t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128);
	}
	return t;
}
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/bl.js
var de = 256, fe = class {
	constructor(e = de) {
		this.chunkSize = e, this.cursor = 0, this.maxCursor = -1, this.chunks = [], this._initReuseChunk = null;
	}
	reset() {
		this.cursor = 0, this.maxCursor = -1, this.chunks.length && (this.chunks = []), this._initReuseChunk !== null && (this.chunks.push(this._initReuseChunk), this.maxCursor = this._initReuseChunk.length - 1);
	}
	pushByte(e) {
		let t = this.chunks[this.chunks.length - 1];
		this.cursor > this.maxCursor && (t = ce(this.chunkSize), this.chunks.push(t), this.maxCursor += t.length, this._initReuseChunk === null && (this._initReuseChunk = t));
		let n = t.length - (this.maxCursor - this.cursor) - 1;
		t[n] = e, this.cursor++;
	}
	push(e) {
		let t = this.chunks[this.chunks.length - 1];
		if (this.cursor + e.length <= this.maxCursor + 1) {
			let n = t.length - (this.maxCursor - this.cursor) - 1;
			t.set(e, n);
		} else {
			if (t) {
				let e = t.length - (this.maxCursor - this.cursor) - 1;
				e < t.length && (this.chunks[this.chunks.length - 1] = t.subarray(0, e), this.maxCursor = this.cursor - 1);
			}
			e.length < 64 && e.length < this.chunkSize ? (t = ce(this.chunkSize), this.chunks.push(t), this.maxCursor += t.length, this._initReuseChunk === null && (this._initReuseChunk = t), t.set(e, 0)) : (this.chunks.push(e), this.maxCursor += e.length);
		}
		this.cursor += e.length;
	}
	toBytes(e = !1) {
		let t;
		if (this.chunks.length === 1) {
			let n = this.chunks[0];
			e && this.cursor > n.length / 2 ? (t = this.cursor === n.length ? n : n.subarray(0, this.cursor), this._initReuseChunk = null, this.chunks = []) : t = oe(n, 0, this.cursor);
		} else t = se(this.chunks, this.cursor);
		return e && this.reset(), t;
	}
}, pe = class {
	constructor(e) {
		this.dest = e, this.cursor = 0, this.chunks = [e];
	}
	reset() {
		this.cursor = 0;
	}
	pushByte(e) {
		if (this.cursor >= this.dest.length) throw Error("write out of bounds, destination buffer is too small");
		this.dest[this.cursor++] = e;
	}
	push(e) {
		if (this.cursor + e.length > this.dest.length) throw Error("write out of bounds, destination buffer is too small");
		this.dest.set(e, this.cursor), this.cursor += e.length;
	}
	toBytes(e = !1) {
		let t = this.dest.subarray(0, this.cursor);
		return e && this.reset(), t;
	}
}, v = "CBOR decode error:", y = "CBOR encode error:";
function me(e, t, n) {
	if (e.length - t < n) throw Error(`${v} not enough data for type`);
}
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/0uint.js
var b = [
	24,
	256,
	65536,
	4294967296,
	BigInt("18446744073709551616")
];
function he(e, t, n) {
	me(e, t, 1);
	let r = e[t];
	if (n.strict === !0 && r < b[0]) throw Error(`${v} integer encoded in more bytes than necessary (strict decode)`);
	return r;
}
function ge(e, t, n) {
	me(e, t, 2);
	let r = e[t] << 8 | e[t + 1];
	if (n.strict === !0 && r < b[1]) throw Error(`${v} integer encoded in more bytes than necessary (strict decode)`);
	return r;
}
function _e(e, t, n) {
	me(e, t, 4);
	let r = e[t] * 16777216 + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3];
	if (n.strict === !0 && r < b[2]) throw Error(`${v} integer encoded in more bytes than necessary (strict decode)`);
	return r;
}
function ve(e, t, n) {
	me(e, t, 8);
	let r = e[t] * 16777216 + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3], i = e[t + 4] * 16777216 + (e[t + 5] << 16) + (e[t + 6] << 8) + e[t + 7], a = (BigInt(r) << BigInt(32)) + BigInt(i);
	if (n.strict === !0 && a < b[3]) throw Error(`${v} integer encoded in more bytes than necessary (strict decode)`);
	if (a <= 2 ** 53 - 1) return Number(a);
	if (n.allowBigInt === !0) return a;
	throw Error(`${v} integers outside of the safe integer range are not supported`);
}
function ye(e, t, n, r) {
	return new h(m.uint, he(e, t + 1, r), 2);
}
function be(e, t, n, r) {
	return new h(m.uint, ge(e, t + 1, r), 3);
}
function xe(e, t, n, r) {
	return new h(m.uint, _e(e, t + 1, r), 5);
}
function Se(e, t, n, r) {
	return new h(m.uint, ve(e, t + 1, r), 9);
}
function Ce(e, t) {
	return x(e, 0, t.value);
}
function x(e, t, n) {
	if (n < b[0]) {
		let r = Number(n);
		e.pushByte(t | r);
	} else if (n < b[1]) {
		let r = Number(n);
		e.push([t | 24, r]);
	} else if (n < b[2]) {
		let r = Number(n);
		e.push([
			t | 25,
			r >>> 8,
			r & 255
		]);
	} else if (n < b[3]) {
		let r = Number(n);
		e.push([
			t | 26,
			r >>> 24 & 255,
			r >>> 16 & 255,
			r >>> 8 & 255,
			r & 255
		]);
	} else {
		let r = BigInt(n);
		if (r < b[4]) {
			let n = [
				t | 27,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			], i = Number(r & BigInt(4294967295)), a = Number(r >> BigInt(32) & BigInt(4294967295));
			n[8] = i & 255, i >>= 8, n[7] = i & 255, i >>= 8, n[6] = i & 255, i >>= 8, n[5] = i & 255, n[4] = a & 255, a >>= 8, n[3] = a & 255, a >>= 8, n[2] = a & 255, a >>= 8, n[1] = a & 255, e.push(n);
		} else throw Error(`${v} encountered BigInt larger than allowable range`);
	}
}
Ce.encodedSize = function(e) {
	return x.encodedSize(e.value);
}, x.encodedSize = function(e) {
	return e < b[0] ? 1 : e < b[1] ? 2 : e < b[2] ? 3 : e < b[3] ? 5 : 9;
}, Ce.compareTokens = function(e, t) {
	return e.value < t.value ? -1 : +(e.value > t.value);
};
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/1negint.js
function we(e, t, n, r) {
	return new h(m.negint, -1 - he(e, t + 1, r), 2);
}
function Te(e, t, n, r) {
	return new h(m.negint, -1 - ge(e, t + 1, r), 3);
}
function Ee(e, t, n, r) {
	return new h(m.negint, -1 - _e(e, t + 1, r), 5);
}
var De = BigInt(-1), Oe = BigInt(1);
function ke(e, t, n, r) {
	let i = ve(e, t + 1, r);
	if (typeof i != "bigint") {
		let e = -1 - i;
		if (e >= -(2 ** 53 - 1)) return new h(m.negint, e, 9);
	}
	if (r.allowBigInt !== !0) throw Error(`${v} integers outside of the safe integer range are not supported`);
	return new h(m.negint, De - BigInt(i), 9);
}
function Ae(e, t) {
	let n = t.value, r = typeof n == "bigint" ? n * De - Oe : n * -1 - 1;
	x(e, t.type.majorEncoded, r);
}
Ae.encodedSize = function(e) {
	let t = e.value, n = typeof t == "bigint" ? t * De - Oe : t * -1 - 1;
	return n < b[0] ? 1 : n < b[1] ? 2 : n < b[2] ? 3 : n < b[3] ? 5 : 9;
}, Ae.compareTokens = function(e, t) {
	return e.value < t.value ? 1 : e.value > t.value ? -1 : 0;
};
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/2bytes.js
function je(e, t, n, r) {
	me(e, t, n + r);
	let i = e.slice(t + n, t + n + r);
	return new h(m.bytes, i, n + r);
}
function Me(e, t, n, r) {
	return je(e, t, 1, n);
}
function Ne(e, t, n, r) {
	return je(e, t, 2, he(e, t + 1, r));
}
function Pe(e, t, n, r) {
	return je(e, t, 3, ge(e, t + 1, r));
}
function Fe(e, t, n, r) {
	return je(e, t, 5, _e(e, t + 1, r));
}
function Ie(e, t, n, r) {
	let i = ve(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${v} 64-bit integer bytes lengths not supported`);
	return je(e, t, 9, i);
}
function Le(e) {
	return e.encodedBytes === void 0 && (e.encodedBytes = m.equals(e.type, m.string) ? ae(e.value) : e.value), e.encodedBytes;
}
function Re(e, t) {
	let n = Le(t);
	x(e, t.type.majorEncoded, n.length), e.push(n);
}
Re.encodedSize = function(e) {
	let t = Le(e);
	return x.encodedSize(t.length) + t.length;
}, Re.compareTokens = function(e, t) {
	return ze(Le(e), Le(t));
};
function ze(e, t) {
	return e.length < t.length ? -1 : e.length > t.length ? 1 : le(e, t);
}
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/3string.js
var Be = new TextDecoder("utf-8", { ignoreBOM: !0 }), Ve = new TextDecoder("utf-8", {
	ignoreBOM: !0,
	fatal: !0
}), He = 32;
function Ue(e, t, n, r) {
	if (n - t < He) {
		let i = "";
		for (let a = t; a < n; a++) {
			let o = e[a];
			if (o & 128) return r.strictUtf8 === !0 ? We(e, t, n) : Be.decode(e.subarray(t, n));
			i += String.fromCharCode(o);
		}
		return i;
	}
	return r.strictUtf8 === !0 ? We(e, t, n) : Be.decode(e.subarray(t, n));
}
function We(e, t, n) {
	try {
		return Ve.decode(e.subarray(t, n));
	} catch {
		throw Error(`${v} invalid UTF-8 in text string`);
	}
}
function Ge(e, t, n, r, i) {
	let a = n + r;
	me(e, t, a);
	let o = new h(m.string, Ue(e, t + n, t + a, i), a);
	return i.retainStringBytes === !0 && (o.byteValue = e.slice(t + n, t + a)), o;
}
function Ke(e, t, n, r) {
	return Ge(e, t, 1, n, r);
}
function qe(e, t, n, r) {
	return Ge(e, t, 2, he(e, t + 1, r), r);
}
function Je(e, t, n, r) {
	return Ge(e, t, 3, ge(e, t + 1, r), r);
}
function Ye(e, t, n, r) {
	return Ge(e, t, 5, _e(e, t + 1, r), r);
}
function Xe(e, t, n, r) {
	let i = ve(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${v} 64-bit integer string lengths not supported`);
	return Ge(e, t, 9, i, r);
}
var Ze = Re;
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/4array.js
function Qe(e, t, n, r) {
	return new h(m.array, r, n);
}
function $e(e, t, n, r) {
	return Qe(e, t, 1, n);
}
function et(e, t, n, r) {
	return Qe(e, t, 2, he(e, t + 1, r));
}
function tt(e, t, n, r) {
	return Qe(e, t, 3, ge(e, t + 1, r));
}
function nt(e, t, n, r) {
	return Qe(e, t, 5, _e(e, t + 1, r));
}
function rt(e, t, n, r) {
	let i = ve(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${v} 64-bit integer array lengths not supported`);
	return Qe(e, t, 9, i);
}
function it(e, t, n, r) {
	if (r.allowIndefinite === !1) throw Error(`${v} indefinite length items not allowed`);
	return Qe(e, t, 1, Infinity);
}
function at(e, t) {
	x(e, m.array.majorEncoded, t.value);
}
at.compareTokens = Ce.compareTokens, at.encodedSize = function(e) {
	return x.encodedSize(e.value);
};
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/5map.js
function ot(e, t, n, r) {
	return new h(m.map, r, n);
}
function st(e, t, n, r) {
	return ot(e, t, 1, n);
}
function ct(e, t, n, r) {
	return ot(e, t, 2, he(e, t + 1, r));
}
function lt(e, t, n, r) {
	return ot(e, t, 3, ge(e, t + 1, r));
}
function ut(e, t, n, r) {
	return ot(e, t, 5, _e(e, t + 1, r));
}
function dt(e, t, n, r) {
	let i = ve(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${v} 64-bit integer map lengths not supported`);
	return ot(e, t, 9, i);
}
function ft(e, t, n, r) {
	if (r.allowIndefinite === !1) throw Error(`${v} indefinite length items not allowed`);
	return ot(e, t, 1, Infinity);
}
function pt(e, t) {
	x(e, m.map.majorEncoded, t.value);
}
pt.compareTokens = Ce.compareTokens, pt.encodedSize = function(e) {
	return x.encodedSize(e.value);
};
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/6tag.js
function mt(e, t, n, r) {
	return new h(m.tag, n, 1);
}
function ht(e, t, n, r) {
	return new h(m.tag, he(e, t + 1, r), 2);
}
function gt(e, t, n, r) {
	return new h(m.tag, ge(e, t + 1, r), 3);
}
function _t(e, t, n, r) {
	return new h(m.tag, _e(e, t + 1, r), 5);
}
function vt(e, t, n, r) {
	return new h(m.tag, ve(e, t + 1, r), 9);
}
function yt(e, t) {
	x(e, m.tag.majorEncoded, t.value);
}
yt.compareTokens = Ce.compareTokens, yt.encodedSize = function(e) {
	return x.encodedSize(e.value);
};
function bt(e, t, n, r) {
	if (r.allowUndefined === !1) throw Error(`${v} undefined values are not supported`);
	return r.coerceUndefinedToNull === !0 ? new h(m.null, null, 1) : new h(m.undefined, void 0, 1);
}
function xt(e, t, n, r) {
	if (r.allowIndefinite === !1) throw Error(`${v} indefinite length items not allowed`);
	return new h(m.break, void 0, 1);
}
function St(e, t, n) {
	if (n) {
		if (n.allowNaN === !1 && Number.isNaN(e)) throw Error(`${v} NaN values are not supported`);
		if (n.allowInfinity === !1 && (e === Infinity || e === -Infinity)) throw Error(`${v} Infinity values are not supported`);
	}
	return new h(m.float, e, t);
}
function Ct(e, t, n, r) {
	return St(kt(e, t + 1), 3, r);
}
function wt(e, t, n, r) {
	return St(jt(e, t + 1), 5, r);
}
function Tt(e, t, n, r) {
	return St(Nt(e, t + 1), 9, r);
}
function Et(e, t, n) {
	let r = t.value;
	if (r === !1) e.pushByte(m.float.majorEncoded | 20);
	else if (r === !0) e.pushByte(m.float.majorEncoded | 21);
	else if (r === null) e.pushByte(m.float.majorEncoded | 22);
	else if (r === void 0) e.pushByte(m.float.majorEncoded | 23);
	else {
		let t, i = !1;
		n && n.float64 === !0 || (Ot(r), t = kt(C, 1), r === t || Number.isNaN(r) ? (C[0] = 249, e.push(C.slice(0, 3)), i = !0) : (At(r), t = jt(C, 1), r === t && (C[0] = 250, e.push(C.slice(0, 5)), i = !0))), i || (Mt(r), t = Nt(C, 1), C[0] = 251, e.push(C.slice(0, 9)));
	}
}
Et.encodedSize = function(e, t) {
	let n = e.value;
	if (n === !1 || n === !0 || n == null) return 1;
	if (!t || t.float64 !== !0) {
		Ot(n);
		let e = kt(C, 1);
		if (n === e || Number.isNaN(n)) return 3;
		if (At(n), e = jt(C, 1), n === e) return 5;
	}
	return 9;
};
var Dt = /* @__PURE__ */ new ArrayBuffer(9), S = new DataView(Dt, 1), C = new Uint8Array(Dt, 0);
function Ot(e) {
	if (e === Infinity) S.setUint16(0, 31744, !1);
	else if (e === -Infinity) S.setUint16(0, 64512, !1);
	else if (Number.isNaN(e)) S.setUint16(0, 32256, !1);
	else {
		S.setFloat32(0, e);
		let t = S.getUint32(0), n = (t & 2139095040) >> 23, r = t & 8388607;
		if (n === 255) S.setUint16(0, 31744, !1);
		else if (n === 0) S.setUint16(0, (t & 2147483648) >> 16 | r >> 13, !1);
		else {
			let e = n - 127;
			e < -24 ? S.setUint16(0, 0) : e < -14 ? S.setUint16(0, (t & 2147483648) >> 16 | 1 << 24 + e, !1) : S.setUint16(0, (t & 2147483648) >> 16 | e + 15 << 10 | r >> 13, !1);
		}
	}
}
function kt(e, t) {
	if (e.length - t < 2) throw Error(`${v} not enough data for float16`);
	let n = (e[t] << 8) + e[t + 1];
	if (n === 31744) return Infinity;
	if (n === 64512) return -Infinity;
	if (n === 32256) return NaN;
	let r = n >> 10 & 31, i = n & 1023, a;
	return a = r === 0 ? i * 2 ** -24 : r === 31 ? i === 0 ? Infinity : NaN : (i + 1024) * 2 ** (r - 25), n & 32768 ? -a : a;
}
function At(e) {
	S.setFloat32(0, e, !1);
}
function jt(e, t) {
	if (e.length - t < 4) throw Error(`${v} not enough data for float32`);
	let n = (e.byteOffset || 0) + t;
	return new DataView(e.buffer, n, 4).getFloat32(0, !1);
}
function Mt(e) {
	S.setFloat64(0, e, !1);
}
function Nt(e, t) {
	if (e.length - t < 8) throw Error(`${v} not enough data for float64`);
	let n = (e.byteOffset || 0) + t;
	return new DataView(e.buffer, n, 8).getFloat64(0, !1);
}
function Pt(e, t) {
	let n = e.value;
	if (n === !1) return Uint8Array.of(m.float.majorEncoded | 20);
	if (n === !0) return Uint8Array.of(m.float.majorEncoded | 21);
	if (n === null) return Uint8Array.of(m.float.majorEncoded | 22);
	if (n === void 0) return Uint8Array.of(m.float.majorEncoded | 23);
	if (!t) {
		if (Ot(n), n === kt(C, 1) || Number.isNaN(n)) return C[0] = 249, C.slice(0, 3);
		if (At(n), n === jt(C, 1)) return C[0] = 250, C.slice(0, 5);
	}
	return Mt(n), C[0] = 251, C.slice(0, 9);
}
function Ft(e, t) {
	let n = e, r = t?.float64 === !0, i = r ? n._keyBytesFloat64 : n._keyBytes;
	if (i !== void 0) return i;
	let a = Pt(e, r);
	return r ? n._keyBytesFloat64 = a : n._keyBytes = a, a;
}
Et.compareTokens = function(e, t, n) {
	let r = Ft(e, n), i = Ft(t, n);
	return r.length === i.length ? le(r, i) : r.length < i.length ? -1 : 1;
};
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/jump.js
function w(e, t, n) {
	throw Error(`${v} encountered invalid minor (${n}) for major ${e[t] >>> 5}`);
}
function It(e) {
	return () => {
		throw Error(`${v} ${e}`);
	};
}
var T = [];
for (let e = 0; e <= 23; e++) T[e] = w;
T[24] = ye, T[25] = be, T[26] = xe, T[27] = Se, T[28] = w, T[29] = w, T[30] = w, T[31] = w;
for (let e = 32; e <= 55; e++) T[e] = w;
T[56] = we, T[57] = Te, T[58] = Ee, T[59] = ke, T[60] = w, T[61] = w, T[62] = w, T[63] = w;
for (let e = 64; e <= 87; e++) T[e] = Me;
T[88] = Ne, T[89] = Pe, T[90] = Fe, T[91] = Ie, T[92] = w, T[93] = w, T[94] = w, T[95] = It("indefinite length bytes/strings are not supported");
for (let e = 96; e <= 119; e++) T[e] = Ke;
T[120] = qe, T[121] = Je, T[122] = Ye, T[123] = Xe, T[124] = w, T[125] = w, T[126] = w, T[127] = It("indefinite length bytes/strings are not supported");
for (let e = 128; e <= 151; e++) T[e] = $e;
T[152] = et, T[153] = tt, T[154] = nt, T[155] = rt, T[156] = w, T[157] = w, T[158] = w, T[159] = it;
for (let e = 160; e <= 183; e++) T[e] = st;
T[184] = ct, T[185] = lt, T[186] = ut, T[187] = dt, T[188] = w, T[189] = w, T[190] = w, T[191] = ft;
for (let e = 192; e <= 215; e++) T[e] = mt;
T[216] = ht, T[217] = gt, T[218] = _t, T[219] = vt, T[220] = w, T[221] = w, T[222] = w, T[223] = w;
for (let e = 224; e <= 243; e++) T[e] = It("simple values are not supported");
T[244] = w, T[245] = w, T[246] = w, T[247] = bt, T[248] = It("simple values are not supported"), T[249] = Ct, T[250] = wt, T[251] = Tt, T[252] = w, T[253] = w, T[254] = w, T[255] = xt;
var Lt = [];
for (let e = 0; e < 24; e++) Lt[e] = new h(m.uint, e, 1);
for (let e = -1; e >= -24; e--) Lt[31 - e] = new h(m.negint, e, 1);
Lt[64] = new h(m.bytes, /* @__PURE__ */ new Uint8Array(), 1), Lt[96] = new h(m.string, "", 1), Lt[128] = new h(m.array, 0, 1), Lt[160] = new h(m.map, 0, 1), Lt[244] = new h(m.false, !1, 1), Lt[245] = new h(m.true, !0, 1), Lt[246] = new h(m.null, null, 1);
function Rt(e) {
	switch (e.type) {
		case m.false: return _([244]);
		case m.true: return _([245]);
		case m.null: return _([246]);
		case m.bytes: return e.value.length ? void 0 : _([64]);
		case m.string: return e.value === "" ? _([96]) : void 0;
		case m.array: return e.value === 0 ? _([128]) : void 0;
		case m.map: return e.value === 0 ? _([160]) : void 0;
		case m.uint: return e.value < 24 ? _([Number(e.value)]) : void 0;
		case m.negint: if (e.value >= -24) return _([31 - Number(e.value)]);
	}
}
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/encode.js
var zt = Object.freeze({
	mapSorter: Jt,
	quickEncodeToken: Rt
});
function Bt() {
	let e = [];
	return e[m.uint.major] = Ce, e[m.negint.major] = Ae, e[m.bytes.major] = Re, e[m.string.major] = Ze, e[m.array.major] = at, e[m.map.major] = pt, e[m.tag.major] = yt, e[m.float.major] = Et, e;
}
var Vt = Bt(), Ht = new fe(), Ut = class e {
	constructor(e, t) {
		this.obj = e, this.parent = t;
	}
	includes(e) {
		let t = this;
		do
			if (t.obj === e) return !0;
		while (t = t.parent);
		return !1;
	}
	static createCheck(t, n) {
		if (t && t.includes(n)) throw Error(`${y} object contains circular references`);
		return new e(n, t);
	}
}, Wt = {
	null: new h(m.null, null),
	undefined: new h(m.undefined, void 0),
	true: new h(m.true, !0),
	false: new h(m.false, !1),
	emptyArray: new h(m.array, 0),
	emptyMap: new h(m.map, 0)
}, Gt = {
	number(e, t, n, r) {
		return !Number.isInteger(e) || !Number.isSafeInteger(e) ? new h(m.float, e) : e >= 0 ? new h(m.uint, e) : new h(m.negint, e);
	},
	bigint(e, t, n, r) {
		return e >= BigInt(0) ? new h(m.uint, e) : new h(m.negint, e);
	},
	Uint8Array(e, t, n, r) {
		return new h(m.bytes, e);
	},
	string(e, t, n, r) {
		return new h(m.string, e);
	},
	boolean(e, t, n, r) {
		return e ? Wt.true : Wt.false;
	},
	null(e, t, n, r) {
		return Wt.null;
	},
	undefined(e, t, n, r) {
		return Wt.undefined;
	},
	ArrayBuffer(e, t, n, r) {
		return new h(m.bytes, new Uint8Array(e));
	},
	DataView(e, t, n, r) {
		return new h(m.bytes, new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
	},
	Array(e, t, n, r) {
		if (!e.length) return n.addBreakTokens === !0 ? [Wt.emptyArray, new h(m.break)] : Wt.emptyArray;
		r = Ut.createCheck(r, e);
		let i = [], a = 0;
		for (let t of e) i[a++] = Kt(t, n, r);
		return n.addBreakTokens ? [
			new h(m.array, e.length),
			i,
			new h(m.break)
		] : [new h(m.array, e.length), i];
	},
	Object(e, t, n, r) {
		let i = t !== "Object", a = i ? e.keys() : Object.keys(e), o = i ? e.size : a.length, s;
		if (o) {
			s = Array(o), r = Ut.createCheck(r, e);
			let t = !i && n.ignoreUndefinedProperties, c = 0;
			for (let o of a) {
				let a = i ? e.get(o) : e[o];
				t && a === void 0 || (s[c++] = [Kt(o, n, r), Kt(a, n, r)]);
			}
			c < o && (s.length = c);
		}
		return s?.length ? (qt(s, n), n.addBreakTokens ? [
			new h(m.map, s.length),
			s,
			new h(m.break)
		] : [new h(m.map, s.length), s]) : n.addBreakTokens === !0 ? [Wt.emptyMap, new h(m.break)] : Wt.emptyMap;
	},
	Tagged(e, t, n, r) {
		return [new h(m.tag, e.tag), Kt(e.value, n, r)];
	}
};
Gt.Map = Gt.Object, Gt.Buffer = Gt.Uint8Array;
for (let e of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) Gt[`${e}Array`] = Gt.DataView;
function Kt(e, t = {}, n) {
	let r = f(e), i = t && t.typeEncoders && t.typeEncoders[r] || Gt[r];
	if (typeof i == "function") {
		let a = i(e, r, t, n);
		if (a != null) return a;
	}
	let a = Gt[r];
	if (!a) throw Error(`${y} unsupported type: ${r}`);
	return a(e, r, t, n);
}
function qt(e, t) {
	let n = t.mapSorter;
	n && e.sort((e, r) => n(e, r, t));
}
function Jt(e, t) {
	if (e[0] instanceof h && t[0] instanceof h) {
		let n = e[0], r = t[0];
		return n._keyBytes ||= Yt(n.value), r._keyBytes ||= Yt(r.value), le(n._keyBytes, r._keyBytes);
	}
	throw Error("rfc8949MapSorter: complex key types are not supported yet");
}
function Yt(e) {
	return Zt(e, Vt, zt);
}
function Xt(e, t, n, r) {
	if (Array.isArray(t)) for (let i of t) Xt(e, i, n, r);
	else n[t.type.major](e, t, r);
}
m.uint.majorEncoded, m.negint.majorEncoded, m.bytes.majorEncoded, m.string.majorEncoded, m.array.majorEncoded, m.map.majorEncoded, m.float.majorEncoded | 20, m.float.majorEncoded | 21, m.float.majorEncoded | 22, m.float.majorEncoded | 23;
function Zt(e, t, n, r) {
	let i = r instanceof Uint8Array, a = i ? new pe(r) : Ht, o = Kt(e, n);
	if (!Array.isArray(o) && n.quickEncodeToken) {
		let e = n.quickEncodeToken(o);
		if (e) return i ? (a.push(e), a.toBytes()) : e;
		let r = t[o.type.major];
		if (r.encodedSize) {
			let e = r.encodedSize(o, n);
			if (i || (a = new fe(e)), r(a, o, n), a.chunks.length !== 1) throw Error(`Unexpected error: pre-calculated length for ${o} was wrong`);
			return i ? a.toBytes() : ne(a.chunks[0]);
		}
	}
	return a.reset(), Xt(a, o, t, n), a.toBytes(!0);
}
// node_modules/.pnpm/cborg@6.2.1/node_modules/cborg/lib/decode.js
var Qt = {
	strict: !1,
	allowIndefinite: !0,
	allowUndefined: !0,
	allowBigInt: !0
}, $t = class {
	constructor(e, t = {}) {
		this._pos = 0, this.data = e, this.options = t;
	}
	pos() {
		return this._pos;
	}
	done() {
		return this._pos >= this.data.length;
	}
	next() {
		let e = this.data[this._pos], t = Lt[e];
		if (t === void 0) {
			let n = T[e];
			if (!n) throw Error(e === void 0 ? `${v} not enough data` : `${v} no decoder for major type ${e >>> 5} (byte 0x${e.toString(16).padStart(2, "0")})`);
			let r = e & 31;
			t = n(this.data, this._pos, r, this.options);
		}
		return this._pos += t.encodedLength, t;
	}
}, en = Symbol.for("DONE"), tn = Symbol.for("BREAK");
function nn(e, t, n) {
	let r = [];
	for (let i = 0; i < e.value; i++) {
		let a = sn(t, n);
		if (a === tn) {
			if (e.value === Infinity) break;
			throw Error(`${v} got unexpected break to lengthed array`);
		}
		if (a === en) throw Error(`${v} found array but not enough entries (got ${i}, expected ${e.value})`);
		r[i] = a;
	}
	return r;
}
function rn(e, t, n) {
	let r = n.useMaps === !0, i = n.rejectDuplicateMapKeys === !0, a = r ? void 0 : {}, o = r ? /* @__PURE__ */ new Map() : void 0;
	for (let s = 0; s < e.value; s++) {
		let c = sn(t, n);
		if (c === tn) {
			if (e.value === Infinity) break;
			throw Error(`${v} got unexpected break to lengthed map`);
		}
		if (c === en) throw Error(`${v} found map but not enough entries (got ${s} [no key], expected ${e.value})`);
		if (!r && typeof c != "string") throw Error(`${v} non-string keys not supported (got ${typeof c})`);
		if (i && (r && o.has(c) || !r && Object.hasOwn(a, c))) throw Error(`${v} found repeat map key "${c}"`);
		let l = sn(t, n);
		if (l === en) throw Error(`${v} found map but not enough entries (got ${s} [no value], expected ${e.value})`);
		if (l === tn) throw Error(`${v} got unexpected break to map value`);
		r ? o.set(c, l) : c === "__proto__" ? Object.defineProperty(a, c, {
			value: l,
			configurable: !0,
			enumerable: !0,
			writable: !0
		}) : a[c] = l;
	}
	return r ? o : a;
}
function* an(e, t, n) {
	for (let r = 0; r < e.value; r++) {
		let i = sn(t, n);
		if (i === tn) {
			if (e.value === Infinity) break;
			throw Error(`${v} got unexpected break to lengthed map`);
		}
		if (i === en) throw Error(`${v} found map but not enough entries (got ${r} [no key], expected ${e.value})`);
		let a = sn(t, n);
		if (a === en) throw Error(`${v} found map but not enough entries (got ${r} [no value], expected ${e.value})`);
		if (a === tn) throw Error(`${v} got unexpected break to map value`);
		yield [i, a];
	}
}
function on(e, t) {
	let n = function() {
		if (n._called) throw Error(`${v} tag decode() may only be called once`);
		n._called = !0;
		let r = sn(e, t);
		if (r === en) throw Error(`${v} tag content missing`);
		if (r === tn) throw Error(`${v} got unexpected break in tag content`);
		return r;
	};
	return n.entries = function() {
		if (n._called) throw Error(`${v} tag decode() may only be called once`);
		if (n._called = !0, e.done()) throw Error(`${v} tag content missing`);
		let r = e.next();
		if (!m.equals(r.type, m.map)) throw Error(`${v} entries() requires map content, got ${r.type.name}`);
		let i = [];
		for (let n of an(r, e, t)) i.push(n);
		return i;
	}, n._called = !1, n;
}
function sn(e, t) {
	if (e.done()) return en;
	let n = e.next();
	if (m.equals(n.type, m.break)) return tn;
	if (n.type.terminal) return n.value;
	if (m.equals(n.type, m.array)) return nn(n, e, t);
	if (m.equals(n.type, m.map)) return rn(n, e, t);
	if (m.equals(n.type, m.tag)) {
		if (t.tags && typeof t.tags[n.value] == "function") {
			let r = on(e, t), i = t.tags[n.value](r);
			if (!r._called) throw Error(`${v} tag decoder must call decode() or entries()`);
			return i;
		}
		throw Error(`${v} tag not supported (${n.value})`);
	}
	throw Error("unsupported");
}
function cn(e, t) {
	if (!(e instanceof Uint8Array)) throw Error(`${v} data to decode must be a Uint8Array`);
	t = Object.assign({}, Qt, t);
	let n = ne(e), r = t.tokenizer || new $t(n, t), i = sn(r, t);
	if (i === en) throw Error(`${v} did not find any content to decode`);
	if (i === tn) throw Error(`${v} got unexpected break`);
	return [i, e.subarray(r.pos())];
}
function ln(e, t) {
	let [n, r] = cn(e, t);
	if (r.length > 0) throw Error(`${v} too many terminals, data makes no sense`);
	return n;
}
Object.defineProperty(class e {
	constructor(e, t) {
		if (typeof e != "number" || !Number.isInteger(e) || e < 0) throw TypeError("Tagged: tag must be a non-negative integer");
		this.tag = e, this.value = t;
	}
	static decoder(t) {
		return (n) => new e(t, n());
	}
	static preserve(...t) {
		let n = {};
		for (let r of t) n[r] = e.decoder(r);
		return n;
	}
}.prototype, Symbol.toStringTag, { value: "Tagged" });
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/bytes.js
function un(e, t) {
	if (e === t) return !0;
	if (e.byteLength !== t.byteLength) return !1;
	for (let n = 0; n < e.byteLength; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function dn(e) {
	if (e instanceof Uint8Array && e.constructor.name === "Uint8Array") return gn(e);
	if (e instanceof ArrayBuffer) return new Uint8Array(e);
	if (ArrayBuffer.isView(e)) return gn(new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
	throw Error("Unknown type, must be binary type");
}
function fn(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	return t;
}
var pn = 4096;
function mn(e) {
	let t = e.length;
	if (t <= pn) return String.fromCharCode.apply(String, e);
	let n = "", r = 0;
	for (; r < t;) n += String.fromCharCode.apply(String, e.subarray(r, r += pn));
	return n;
}
function hn(e) {
	return e?.buffer instanceof ArrayBuffer;
}
function gn(e) {
	return hn(e) ? e : e.slice();
}
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/vendor/base-x.js
function _n(e, t, n) {
	if (e.length >= 255) throw TypeError("Alphabet too long");
	for (var r = /* @__PURE__ */ new Uint8Array(256), i = 0; i < r.length; i++) r[i] = 255;
	for (var a = 0; a < e.length; a++) {
		var o = e.charAt(a), s = o.charCodeAt(0);
		if (r[s] !== 255) throw TypeError(o + " is ambiguous");
		if (r[s] = a, n) {
			var c = o.toLowerCase().charCodeAt(0), l = o.toUpperCase().charCodeAt(0);
			c !== s && (r[c] = a), l !== s && (r[l] = a);
		}
	}
	var u = e.length, d = e.charAt(0), f = Math.log(u) / Math.log(256), p = Math.log(256) / Math.log(u);
	function m(t) {
		if (t instanceof Uint8Array || (ArrayBuffer.isView(t) ? t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : Array.isArray(t) && (t = Uint8Array.from(t))), !(t instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
		if (t.length === 0) return "";
		for (var n = 0, r = 0, i = 0, a = t.length; i !== a && t[i] === 0;) i++, n++;
		for (var o = (a - i) * p + 1 >>> 0, s = new Uint8Array(o); i !== a;) {
			for (var c = t[i], l = 0, f = o - 1; (c !== 0 || l < r) && f !== -1; f--, l++) c += 256 * s[f] >>> 0, s[f] = c % u >>> 0, c = c / u >>> 0;
			if (c !== 0) throw Error("Non-zero carry");
			r = l, i++;
		}
		for (var m = o - r; m !== o && s[m] === 0;) m++;
		for (var h = d.repeat(n); m < o; ++m) h += e.charAt(s[m]);
		return h;
	}
	function h(e) {
		if (typeof e != "string") throw TypeError("Expected String");
		if (e.length === 0) return /* @__PURE__ */ new Uint8Array();
		var t = 0;
		if (e[t] !== " ") {
			for (var n = 0, i = 0; e[t] === d;) n++, t++;
			for (var a = (e.length - t) * f + 1 >>> 0, o = new Uint8Array(a); e[t];) {
				var s = r[e.charCodeAt(t)];
				if (s === 255) return;
				for (var c = 0, l = a - 1; (s !== 0 || c < i) && l !== -1; l--, c++) s += u * o[l] >>> 0, o[l] = s % 256 >>> 0, s = s / 256 >>> 0;
				if (s !== 0) throw Error("Non-zero carry");
				i = c, t++;
			}
			if (e[t] !== " ") {
				for (var p = a - i; p !== a && o[p] === 0;) p++;
				for (var m = new Uint8Array(n + (a - p)), h = n; p !== a;) m[h++] = o[p++];
				return m;
			}
		}
	}
	function g(e) {
		var n = h(e);
		if (n) return n;
		throw Error(`Non-${t} character`);
	}
	return {
		encode: m,
		decodeUnsafe: h,
		decode: g
	};
}
var vn = _n, yn = class {
	name;
	prefix;
	baseEncode;
	constructor(e, t, n) {
		this.name = e, this.prefix = t, this.baseEncode = n;
	}
	encode(e) {
		if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
		throw Error("Unknown type, must be binary type");
	}
}, bn = class {
	name;
	prefix;
	baseDecode;
	prefixCodePoint;
	constructor(e, t, n) {
		this.name = e, this.prefix = t;
		let r = t.codePointAt(0);
		/* c8 ignore next 3 */
		if (r === void 0) throw Error("Invalid prefix character");
		this.prefixCodePoint = r, this.baseDecode = n;
	}
	decode(e) {
		if (typeof e == "string") {
			if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(e.slice(this.prefix.length));
		}
		throw Error("Can only multibase decode strings");
	}
	or(e) {
		return Sn(this, e);
	}
}, xn = class {
	decoders;
	constructor(e) {
		this.decoders = e;
	}
	or(e) {
		return Sn(this, e);
	}
	decode(e) {
		let t = e[0], n = this.decoders[t];
		if (n != null) return n.decode(e);
		throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
function Sn(e, t) {
	return new xn({
		...e.decoders ?? { [e.prefix]: e },
		...t.decoders ?? { [t.prefix]: t }
	});
}
var Cn = class {
	name;
	prefix;
	baseEncode;
	baseDecode;
	encoder;
	decoder;
	constructor(e, t, n, r) {
		this.name = e, this.prefix = t, this.baseEncode = n, this.baseDecode = r, this.encoder = new yn(e, t, n), this.decoder = new bn(e, t, r);
	}
	encode(e) {
		return this.encoder.encode(e);
	}
	decode(e) {
		return this.decoder.decode(e);
	}
};
function wn({ name: e, prefix: t, encode: n, decode: r }) {
	return new Cn(e, t, n, r);
}
function Tn({ name: e, prefix: t, alphabet: n, caseInsensitive: r = !1 }) {
	let { encode: i, decode: a } = vn(n, e, r);
	return wn({
		prefix: t,
		name: e,
		encode: i,
		decode: (e) => dn(a(e))
	});
}
function En(e, t, n, r) {
	let i = e.length;
	for (; e[i - 1] === "=";) --i;
	let a = new Uint8Array(i * n / 8 | 0), o = 0, s = 0, c = 0;
	for (let l = 0; l < i; ++l) {
		let i = t[e[l]];
		if (i === void 0) throw SyntaxError(`Non-${r} character`);
		s = s << n | i, o += n, o >= 8 && (o -= 8, a[c++] = 255 & s >> o);
	}
	if (o >= n || 255 & s << 8 - o) throw SyntaxError("Unexpected end of data");
	return a;
}
function Dn(e, t, n) {
	let r = t[t.length - 1] === "=", i = (1 << n) - 1, a = "", o = 0, s = 0;
	for (let r = 0; r < e.length; ++r) for (s = s << 8 | e[r], o += 8; o > n;) o -= n, a += t[i & s >> o];
	if (o !== 0 && (a += t[i & s << n - o]), r) for (; a.length * n & 7;) a += "=";
	return a;
}
function On(e, t) {
	let n = {};
	for (let r = 0; r < e.length; ++r) if (n[e[r]] = r, t) {
		let t = e[r].toLowerCase(), i = e[r].toUpperCase();
		t !== e[r] && (n[t] = r), i !== e[r] && (n[i] = r);
	}
	return n;
}
function E({ name: e, prefix: t, bitsPerChar: n, alphabet: r, caseInsensitive: i = !1 }) {
	let a = On(r, i);
	return wn({
		prefix: t,
		name: e,
		encode(e) {
			return Dn(e, r, n);
		},
		decode(t) {
			return En(t, a, n, e);
		}
	});
}
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/bases/base32.js
var kn = /* @__PURE__ */ c({
	base32: () => An,
	base32hex: () => Pn,
	base32hexpad: () => In,
	base32hexpadupper: () => Ln,
	base32hexupper: () => Fn,
	base32pad: () => Mn,
	base32padupper: () => Nn,
	base32upper: () => jn,
	base32z: () => Rn
}), An = E({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5,
	caseInsensitive: !0
}), jn = E({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5,
	caseInsensitive: !0
}), Mn = E({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), Nn = E({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), Pn = E({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5,
	caseInsensitive: !0
}), Fn = E({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5,
	caseInsensitive: !0
}), In = E({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), Ln = E({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5,
	caseInsensitive: !0
}), Rn = E({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
}), zn = /* @__PURE__ */ c({
	base36: () => Bn,
	base36upper: () => Vn
}), Bn = Tn({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz",
	caseInsensitive: !0
}), Vn = Tn({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	caseInsensitive: !0
}), Hn = /* @__PURE__ */ c({
	base58btc: () => Un,
	base58flickr: () => Wn
}), Un = Tn({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
}), Wn = Tn({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
}), Gn = Yn, Kn = 128, qn = -128, Jn = 2 ** 31;
function Yn(e, t, n) {
	t ||= [], n ||= 0;
	for (var r = n; e >= Jn;) t[n++] = e & 255 | Kn, e /= 128;
	for (; e & qn;) t[n++] = e & 255 | Kn, e >>>= 7;
	return t[n] = e | 0, Yn.bytes = n - r + 1, t;
}
var Xn = $n, Zn = 128, Qn = 127;
function $n(e, t) {
	var n = 0, t = t || 0, r = 0, i = t, a, o = e.length;
	do {
		if (i >= o) throw $n.bytes = 0, RangeError("Could not decode varint");
		a = e[i++], n += r < 28 ? (a & Qn) << r : (a & Qn) * 2 ** r, r += 7;
	} while (a >= Zn);
	return $n.bytes = i - t, n;
}
var er = 128, tr = 2 ** 14, nr = 2 ** 21, rr = 2 ** 28, ir = 2 ** 35, ar = 2 ** 42, or = 2 ** 49, sr = 2 ** 56, cr = 2 ** 63, lr = {
	encode: Gn,
	decode: Xn,
	encodingLength: function(e) {
		return e < er ? 1 : e < tr ? 2 : e < nr ? 3 : e < rr ? 4 : e < ir ? 5 : e < ar ? 6 : e < or ? 7 : e < sr ? 8 : e < cr ? 9 : 10;
	}
};
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/varint.js
function ur(e, t = 0) {
	let n = lr.decode(e, t), r = lr.decode.bytes;
	if (r > 9) throw RangeError("Invalid varint: too long");
	if (r > 1 && e[t + r - 1] === 0) throw RangeError("Invalid varint: not minimally encoded");
	return [n, r];
}
function dr(e, t, n = 0) {
	return lr.encode(e, t, n), t;
}
function fr(e) {
	return lr.encodingLength(e);
}
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/hashes/digest.js
function pr(e, t) {
	let n = t.byteLength, r = fr(e), i = r + fr(n), a = new Uint8Array(i + n);
	return dr(e, a, 0), dr(n, a, r), a.set(t, i), new gr(e, n, t, a);
}
function mr(e) {
	let t = dn(e), [n, r] = ur(t), [i, a] = ur(t.subarray(r)), o = t.subarray(r + a);
	if (o.byteLength !== i) throw Error("Incorrect length");
	return new gr(n, i, o, t);
}
function hr(e, t) {
	if (e === t) return !0;
	{
		let n = t;
		return e.code === n.code && e.size === n.size && n.bytes instanceof Uint8Array && un(e.bytes, n.bytes);
	}
}
var gr = class {
	code;
	size;
	digest;
	bytes;
	constructor(e, t, n, r) {
		this.code = e, this.size = t, this.digest = gn(n), this.bytes = gn(r);
	}
};
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/cid.js
function _r(e, t) {
	let { bytes: n, version: r } = e;
	switch (r) {
		case 0: return Sr(n, yr(e), t ?? Un.encoder);
		default: return Cr(n, yr(e), t ?? An.encoder);
	}
}
var vr = /* @__PURE__ */ new WeakMap();
function yr(e) {
	let t = vr.get(e);
	if (t == null) {
		let t = /* @__PURE__ */ new Map();
		return vr.set(e, t), t;
	}
	return t;
}
var br = class e {
	code;
	version;
	multihash;
	bytes;
	"/";
	constructor(e, t, n, r) {
		this.code = t, this.version = e, this.multihash = n, this.bytes = gn(r), this["/"] = this.bytes;
	}
	get asCID() {
		return this;
	}
	get byteOffset() {
		return this.bytes.byteOffset;
	}
	get byteLength() {
		return this.bytes.byteLength;
	}
	toV0() {
		switch (this.version) {
			case 0: return this;
			case 1: {
				let { code: t, multihash: n } = this;
				if (t !== wr) throw Error("Cannot convert a non dag-pb CID to CIDv0");
				if (n.code !== Tr) throw Error("Cannot convert non sha2-256 multihash CID to CIDv0");
				return e.createV0(n);
			}
			default: throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
		}
	}
	toV1() {
		switch (this.version) {
			case 0: {
				let { code: t, digest: n } = this.multihash, r = pr(t, n);
				return e.createV1(this.code, r);
			}
			case 1: return this;
			default: throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
		}
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		let n = t;
		return n != null && e.code === n.code && e.version === n.version && hr(e.multihash, n.multihash);
	}
	toString(e) {
		return _r(this, e);
	}
	toJSON() {
		return { "/": _r(this) };
	}
	link() {
		return this;
	}
	[Symbol.toStringTag] = "CID";
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return `CID(${this.toString()})`;
	}
	static asCID(t) {
		if (t == null) return null;
		let n = t;
		if (n instanceof e) return n;
		if (n["/"] != null && n["/"] === n.bytes || n.asCID === n) {
			let { version: t, code: r, multihash: i, bytes: a } = n;
			return new e(t, r, i, a ?? Er(t, r, i.bytes));
		}
		if (n[Dr] === !0) {
			let { version: t, multihash: r, code: i } = n, a = mr(r);
			return e.create(t, i, a);
		}
		return null;
	}
	static create(t, n, r) {
		if (typeof n != "number") throw Error("String codecs are no longer supported");
		if (!(r.bytes instanceof Uint8Array)) throw Error("Invalid digest");
		switch (t) {
			case 0:
				if (n !== wr) throw Error(`Version 0 CID must use dag-pb (code: ${wr}) block encoding`);
				return new e(t, n, r, r.bytes);
			case 1: {
				let i = Er(t, n, r.bytes);
				return new e(t, n, r, i);
			}
			default: throw Error("Invalid version");
		}
	}
	static createV0(t) {
		return e.create(0, wr, t);
	}
	static createV1(t, n) {
		return e.create(1, t, n);
	}
	static decode(t) {
		let [n, r] = e.decodeFirst(t);
		if (r.length !== 0) throw Error("Incorrect length");
		return n;
	}
	static decodeFirst(t) {
		let n = e.inspectBytes(t), r = n.size - n.multihashSize, i = dn(t.subarray(r, r + n.multihashSize));
		if (i.byteLength !== n.multihashSize) throw Error("Incorrect length");
		let a = i.subarray(n.multihashSize - n.digestSize), o = new gr(n.multihashCode, n.digestSize, a, i);
		return [n.version === 0 ? e.createV0(o) : e.createV1(n.codec, o), t.subarray(n.size)];
	}
	static inspectBytes(e) {
		let t = 0, n = () => {
			let [n, r] = ur(e.subarray(t));
			return t += r, n;
		}, r = n(), i = wr;
		if (r === 18 ? (r = 0, t = 0) : i = n(), r !== 0 && r !== 1) throw RangeError(`Invalid CID version ${r}`);
		let a = t, o = n(), s = n(), c = t + s, l = c - a;
		return {
			version: r,
			codec: i,
			multihashCode: o,
			digestSize: s,
			multihashSize: l,
			size: c
		};
	}
	static parse(t, n) {
		let [r, i] = xr(t, n), a = e.decode(i);
		if (a.version === 0 && t[0] !== "Q") throw Error("Version 0 CID string must not include multibase prefix");
		return yr(a).set(r, t), a;
	}
};
function xr(e, t) {
	switch (e[0]) {
		case "Q": {
			let n = t ?? Un;
			return [Un.prefix, n.decode(`${Un.prefix}${e}`)];
		}
		case Un.prefix: {
			let n = t ?? Un;
			return [Un.prefix, n.decode(e)];
		}
		case An.prefix: {
			let n = t ?? An;
			return [An.prefix, n.decode(e)];
		}
		case Bn.prefix: {
			let n = t ?? Bn;
			return [Bn.prefix, n.decode(e)];
		}
		default:
			if (t == null) throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
			return [e[0], t.decode(e)];
	}
}
function Sr(e, t, n) {
	let { prefix: r } = n;
	if (r !== Un.prefix) throw Error(`Cannot string encode V0 in ${n.name} encoding`);
	let i = t.get(r);
	if (i == null) {
		let i = n.encode(e).slice(1);
		return t.set(r, i), i;
	}
	return i;
}
function Cr(e, t, n) {
	let { prefix: r } = n, i = t.get(r);
	if (i == null) {
		let i = n.encode(e);
		return t.set(r, i), i;
	}
	return i;
}
var wr = 112, Tr = 18;
function Er(e, t, n) {
	let r = fr(e), i = r + fr(t), a = new Uint8Array(i + n.byteLength);
	return dr(e, a, 0), dr(t, a, r), a.set(n, i), a;
}
var Dr = Symbol.for("@ipld/js-cid/CID"), Or = 42;
function kr(e) {
	return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
function Ar(e) {
	if (e.asCID !== e && e["/"] !== e.bytes) return null;
	let t = br.asCID(e);
	/* c8 ignore next 4 */
	if (!t) return null;
	let n = new Uint8Array(t.bytes.byteLength + 1);
	return n.set(t.bytes, 1), [new h(m.tag, Or), new h(m.bytes, n)];
}
function jr() {
	throw Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
function Mr(e) {
	if (Number.isNaN(e)) throw Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
	if (e === Infinity || e === -Infinity) throw Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
	return null;
}
function Nr(e) {
	for (let t of e.keys()) if (typeof t != "string" || t.length === 0) throw Error("Non-string Map keys are not supported by the IPLD Data Model and cannot be encoded");
	return null;
}
var Pr = {
	float64: !0,
	typeEncoders: {
		Map: Nr,
		Object: Ar,
		undefined: jr,
		number: Mr
	}
};
({ ...Pr }), { ...Pr.typeEncoders };
function Fr(e) {
	let t = e();
	if (t[0] !== 0) throw Error("Invalid CID for CBOR tag 42; expected leading 0x00");
	return br.decode(t.subarray(1));
}
var Ir = {
	allowIndefinite: !1,
	coerceUndefinedToNull: !0,
	allowNaN: !1,
	allowInfinity: !1,
	allowBigInt: !0,
	strict: !0,
	useMaps: !1,
	rejectDuplicateMapKeys: !0,
	tags: { [Or]: Fr }
};
({ ...Ir }), { ...Ir.tags };
var Lr = (e) => ln(kr(e), Ir), Rr = /* @__PURE__ */ s(((e, t) => {
	t.exports = a;
	var n = 128, r = -128, i = 2 ** 31;
	function a(e, t, o) {
		if (2 ** 53 - 1 && e > 2 ** 53 - 1) throw a.bytes = 0, RangeError("Could not encode varint");
		t ||= [], o ||= 0;
		for (var s = o; e >= i;) t[o++] = e & 255 | n, e /= 128;
		for (; e & r;) t[o++] = e & 255 | n, e >>>= 7;
		return t[o] = e | 0, a.bytes = o - s + 1, t;
	}
})), zr = /* @__PURE__ */ s(((e, t) => {
	t.exports = i;
	var n = 128, r = 127;
	function i(e, t) {
		var a = 0, t = t || 0, o = 0, s = t, c, l = e.length;
		do {
			if (s >= l || o > 49) throw i.bytes = 0, RangeError("Could not decode varint");
			c = e[s++], a += o < 28 ? (c & r) << o : (c & r) * 2 ** o, o += 7;
		} while (c >= n);
		return i.bytes = s - t, a;
	}
})), Br = /* @__PURE__ */ s(((e, t) => {
	var n = 2 ** 14, r = 2 ** 21, i = 2 ** 28, a = 2 ** 35, o = 2 ** 42, s = 2 ** 49, c = 2 ** 56, l = 2 ** 63;
	t.exports = function(e) {
		return e < 128 ? 1 : e < n ? 2 : e < r ? 3 : e < i ? 4 : e < a ? 5 : e < o ? 6 : e < s ? 7 : e < c ? 8 : e < l ? 9 : 10;
	};
})), Vr = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	t.exports = {
		encode: Rr(),
		decode: zr(),
		encodingLength: Br()
	};
})))(), 1), Hr = {
	SHA2_256: 18,
	LENGTH: 32,
	DAG_PB: 112
};
function Ur(e, t) {
	if (!e.length) throw Error("Unexpected end of data");
	let n = Vr.default.decode(e);
	return t.seek(Vr.default.decode.bytes), n;
}
function Wr(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = 0;
	return {
		version: 2,
		characteristics: [t.getBigUint64(n, !0), t.getBigUint64(n += 8, !0)],
		dataOffset: Number(t.getBigUint64(n += 8, !0)),
		dataSize: Number(t.getBigUint64(n += 8, !0)),
		indexOffset: Number(t.getBigUint64(n += 8, !0))
	};
}
function Gr(e) {
	Vr.default.decode(e);
	let t = Vr.default.decode.bytes, n = Vr.default.decode(e.subarray(Vr.default.decode.bytes));
	return t + Vr.default.decode.bytes + n;
}
// node_modules/.pnpm/@ipld+car@5.4.7/node_modules/@ipld/car/src/header-validator.js
var Kr = {
	Null: (e) => e === null ? e : void 0,
	Int: (e) => Number.isInteger(e) ? e : void 0,
	Float: (e) => typeof e == "number" && Number.isFinite(e) ? e : void 0,
	String: (e) => typeof e == "string" ? e : void 0,
	Bool: (e) => typeof e == "boolean" ? e : void 0,
	Bytes: (e) => e instanceof Uint8Array ? e : void 0,
	Link: (e) => typeof e == "object" && e && e.asCID === e ? e : void 0,
	List: (e) => Array.isArray(e) ? e : void 0,
	Map: (e) => typeof e == "object" && e && e.asCID !== e && !Array.isArray(e) && !(e instanceof Uint8Array) ? e : void 0
}, qr = {
	"CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kr.Link,
	"CarV1HeaderOrV2Pragma > roots (anon)": (e) => {
		if (Kr.List(e) !== void 0) {
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (n = qr["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](n), n === void 0) return;
				if (n !== e[t]) {
					let n = e.slice(0, t);
					for (let r = t; r < e.length; r++) {
						let t = e[r];
						if (t = qr["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](t), t === void 0) return;
						n.push(t);
					}
					return n;
				}
			}
			return e;
		}
	},
	Int: Kr.Int,
	CarV1HeaderOrV2Pragma: (e) => {
		if (Kr.Map(e) === void 0) return;
		let t = Object.entries(e), n = e, r = 1;
		for (let i = 0; i < t.length; i++) {
			let [a, o] = t[i];
			switch (a) {
				case "roots":
					{
						let r = qr["CarV1HeaderOrV2Pragma > roots (anon)"](e[a]);
						if (r === void 0) return;
						if (r !== o || n !== e) {
							if (n === e) {
								n = {};
								for (let e = 0; e < i; e++) n[t[e][0]] = t[e][1];
							}
							n.roots = r;
						}
					}
					break;
				case "version":
					{
						r--;
						let s = qr.Int(e[a]);
						if (s === void 0) return;
						if (s !== o || n !== e) {
							if (n === e) {
								n = {};
								for (let e = 0; e < i; e++) n[t[e][0]] = t[e][1];
							}
							n.version = s;
						}
					}
					break;
				default: return;
			}
		}
		if (!(r > 0)) return n;
	}
}, Jr = {
	"CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)": Kr.Link,
	"CarV1HeaderOrV2Pragma > roots (anon)": (e) => {
		if (Kr.List(e) !== void 0) {
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (n = Jr["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](n), n === void 0) return;
				if (n !== e[t]) {
					let n = e.slice(0, t);
					for (let r = t; r < e.length; r++) {
						let t = e[r];
						if (t = Jr["CarV1HeaderOrV2Pragma > roots (anon) > valueType (anon)"](t), t === void 0) return;
						n.push(t);
					}
					return n;
				}
			}
			return e;
		}
	},
	Int: Kr.Int,
	CarV1HeaderOrV2Pragma: (e) => {
		if (Kr.Map(e) === void 0) return;
		let t = Object.entries(e), n = e, r = 1;
		for (let i = 0; i < t.length; i++) {
			let [a, o] = t[i];
			switch (a) {
				case "roots":
					{
						let r = Jr["CarV1HeaderOrV2Pragma > roots (anon)"](o);
						if (r === void 0) return;
						if (r !== o || n !== e) {
							if (n === e) {
								n = {};
								for (let e = 0; e < i; e++) n[t[e][0]] = t[e][1];
							}
							n.roots = r;
						}
					}
					break;
				case "version":
					{
						r--;
						let a = Jr.Int(o);
						if (a === void 0) return;
						if (a !== o || n !== e) {
							if (n === e) {
								n = {};
								for (let e = 0; e < i; e++) n[t[e][0]] = t[e][1];
							}
							n.version = a;
						}
					}
					break;
				default: return;
			}
		}
		if (!(r > 0)) return n;
	}
}, Yr = {
	toTyped: qr.CarV1HeaderOrV2Pragma,
	toRepresentation: Jr.CarV1HeaderOrV2Pragma
};
Bt(), new h(m.map, 2), new h(m.string, "version"), new h(m.uint, 1), new h(m.string, "roots"), new h(m.tag, 42);
// node_modules/.pnpm/@ipld+car@5.4.7/node_modules/@ipld/car/src/decoder.js
async function Xr(e, t) {
	let n = Ur(await e.upTo(8), e);
	if (n === 0) throw Error("Invalid CAR header (zero length)");
	let r = Lr(await e.exactly(n, !0));
	if (Yr.toTyped(r) === void 0) throw Error("Invalid CAR header format");
	if (r.version !== 1 && r.version !== 2 || t !== void 0 && r.version !== t) throw Error(`Invalid CAR version: ${r.version}${t === void 0 ? "" : ` (expected ${t})`}`);
	if (r.version === 1) {
		if (!Array.isArray(r.roots)) throw Error("Invalid CAR header format");
		return r;
	}
	if (r.roots !== void 0) throw Error("Invalid CAR header format");
	let i = Wr(await e.exactly(40, !0));
	e.seek(i.dataOffset - e.pos);
	let a = await Xr(e, 1);
	return Object.assign(a, i);
}
async function Zr(e) {
	let t = await e.exactly(2, !1);
	if (t[0] === Hr.SHA2_256 && t[1] === Hr.LENGTH) {
		let t = mr(await e.exactly(34, !0));
		return br.create(0, Hr.DAG_PB, t);
	}
	let n = Ur(await e.upTo(8), e);
	if (n !== 1) throw Error(`Unexpected CID version (${n})`);
	let r = Ur(await e.upTo(8), e), i = mr(await e.exactly(Gr(await e.upTo(8)), !0));
	return br.create(n, r, i);
}
async function Qr(e) {
	let t = e.pos, n = Ur(await e.upTo(8), e);
	if (n === 0) throw Error("Invalid CAR section (zero length)");
	n += e.pos - t;
	let r = await Zr(e), i = n - Number(e.pos - t);
	return {
		cid: r,
		length: n,
		blockLength: i
	};
}
async function $r(e) {
	let { cid: t, blockLength: n } = await Qr(e);
	return {
		bytes: await e.exactly(n, !0),
		cid: t
	};
}
async function ei(e) {
	let t = e.pos, { cid: n, length: r, blockLength: i } = await Qr(e), a = {
		cid: n,
		length: r,
		blockLength: i,
		offset: t,
		blockOffset: e.pos
	};
	return e.seek(a.blockLength), a;
}
function ti(e) {
	let t = (async () => {
		let t = await Xr(e);
		if (t.version === 2) {
			let n = e.pos - t.dataOffset;
			e = ai(e, t.dataSize - n);
		}
		return t;
	})();
	return {
		header: () => t,
		async *blocks() {
			for (await t; (await e.upTo(8)).length > 0;) yield await $r(e);
		},
		async *blocksIndex() {
			for (await t; (await e.upTo(8)).length > 0;) yield await ei(e);
		}
	};
}
function ni(e) {
	let t = 0;
	return {
		async upTo(n) {
			return e.subarray(t, t + Math.min(n, e.length - t));
		},
		async exactly(n, r = !1) {
			if (n > e.length - t) throw Error("Unexpected end of data");
			let i = e.subarray(t, t + n);
			return r && (t += n), i;
		},
		seek(e) {
			t += e;
		},
		get pos() {
			return t;
		}
	};
}
function ri(e) {
	let t = 0, n = 0, r = 0, i = /* @__PURE__ */ new Uint8Array(), a = async (t) => {
		n = i.length - r;
		let a = [i.subarray(r)];
		for (; n < t;) {
			let t = await e();
			if (t == null) break;
			n < 0 ? 
			/* c8 ignore next 4 */
			t.length > n && a.push(t.subarray(-n)) : a.push(t), n += t.length;
		}
		i = new Uint8Array(a.reduce((e, t) => e + t.length, 0));
		let o = 0;
		for (let e of a) i.set(e, o), o += e.length;
		r = 0;
	};
	return {
		async upTo(e) {
			return i.length - r < e && await a(e), i.subarray(r, r + Math.min(i.length - r, e));
		},
		async exactly(e, n = !1) {
			if (i.length - r < e && await a(e), i.length - r < e) throw Error("Unexpected end of data");
			let o = i.subarray(r, r + e);
			return n && (t += e, r += e), o;
		},
		seek(e) {
			t += e, r += e;
		},
		get pos() {
			return t;
		}
	};
}
function ii(e) {
	let t = e[Symbol.asyncIterator]();
	async function n() {
		let e = await t.next();
		return e.done ? null : e.value;
	}
	return ri(n);
}
function ai(e, t) {
	let n = 0;
	return {
		async upTo(r) {
			let i = await e.upTo(r);
			return i.length + n > t && (i = i.subarray(0, t - n)), i;
		},
		async exactly(r, i = !1) {
			let a = await e.exactly(r, i);
			if (a.length + n > t) throw Error("Unexpected end of data");
			return i && (n += r), a;
		},
		seek(t) {
			n += t, e.seek(t);
		},
		get pos() {
			return e.pos;
		}
	};
}
// node_modules/.pnpm/@ipld+car@5.4.7/node_modules/@ipld/car/src/reader-browser.js
var oi = class {
	constructor(e, t) {
		this._header = e, this._blocks = t, this._keys = t.map((e) => e.cid.toString());
	}
	get version() {
		return this._header.version;
	}
	async getRoots() {
		return this._header.roots;
	}
	async has(e) {
		return this._keys.indexOf(e.toString()) > -1;
	}
	async get(e) {
		let t = this._keys.indexOf(e.toString());
		return t > -1 ? this._blocks[t] : void 0;
	}
	async *blocks() {
		for (let e of this._blocks) yield e;
	}
	async *cids() {
		for (let e of this._blocks) yield e.cid;
	}
	static async fromBytes(e) {
		if (!(e instanceof Uint8Array)) throw TypeError("fromBytes() requires a Uint8Array");
		return si(ni(e));
	}
	static async fromIterable(e) {
		if (!e || typeof e[Symbol.asyncIterator] != "function") throw TypeError("fromIterable() requires an async iterable");
		return si(ii(e));
	}
};
async function si(e) {
	let t = ti(e), n = await t.header(), r = [];
	for await (let e of t.blocks()) r.push(e);
	return new oi(n, r);
}
// node_modules/.pnpm/it-first@3.0.11/node_modules/it-first/dist/src/index.js
function ci(e) {
	return e[Symbol.asyncIterator] != null;
}
function li(e) {
	if (ci(e)) return (async () => {
		for await (let t of e) return t;
	})();
	for (let t of e) return t;
}
// node_modules/.pnpm/it-batch@3.0.11/node_modules/it-batch/dist/src/index.js
function ui(e) {
	return e[Symbol.asyncIterator] != null;
}
function di(e, t = 1) {
	return t = Number(t), ui(e) ? async function* () {
		let n = [];
		if (t < 1 && (t = 1), t !== Math.round(t)) throw Error("Batch size must be an integer");
		for await (let r of e) for (n.push(r); n.length >= t;) yield n.slice(0, t), n = n.slice(t);
		for (; n.length > 0;) yield n.slice(0, t), n = n.slice(t);
	}() : function* () {
		let n = [];
		if (t < 1 && (t = 1), t !== Math.round(t)) throw Error("Batch size must be an integer");
		for (let r of e) for (n.push(r); n.length >= t;) yield n.slice(0, t), n = n.slice(t);
		for (; n.length > 0;) yield n.slice(0, t), n = n.slice(t);
	}();
}
// node_modules/.pnpm/it-parallel-batch@3.0.11/node_modules/it-parallel-batch/dist/src/index.js
async function* fi(e, t = 1) {
	for await (let n of di(e, t)) {
		let e = n.map(async (e) => e().then((e) => ({
			ok: !0,
			value: e
		}), (e) => ({
			ok: !1,
			err: e
		})));
		for (let t = 0; t < e.length; t++) {
			let n = await e[t];
			if (n.ok) yield n.value;
			else throw n.err;
		}
	}
}
// node_modules/.pnpm/uint8arrays@5.1.1/node_modules/uint8arrays/dist/src/alloc.js
function pi(e = 0) {
	return new Uint8Array(e);
}
function mi(e = 0) {
	return new Uint8Array(e);
}
// node_modules/.pnpm/uint8arrays@5.1.1/node_modules/uint8arrays/dist/src/util/as-uint8array.js
function hi(e) {
	return e;
}
// node_modules/.pnpm/uint8arrays@5.1.1/node_modules/uint8arrays/dist/src/concat.js
function gi(e, t) {
	t ??= e.reduce((e, t) => e + t.length, 0);
	let n = mi(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return hi(n);
}
// node_modules/.pnpm/uint8arrays@5.1.1/node_modules/uint8arrays/dist/src/equals.js
function _i(e, t) {
	if (e === t) return !0;
	if (e.byteLength !== t.byteLength) return !1;
	for (let n = 0; n < e.byteLength; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
// node_modules/.pnpm/uint8arraylist@2.4.9/node_modules/uint8arraylist/dist/src/index.js
var vi = Symbol.for("@achingbrain/uint8arraylist");
function yi(e, t) {
	if (t == null || t < 0) throw RangeError("index is out of bounds");
	let n = 0;
	for (let r of e) {
		let e = n + r.byteLength;
		if (t < e) return {
			buf: r,
			index: t - n
		};
		n = e;
	}
	throw RangeError("index is out of bounds");
}
function bi(e) {
	return !!e?.[vi];
}
var xi = class e {
	bufs;
	length;
	[vi] = !0;
	constructor(...e) {
		this.bufs = [], this.length = 0, e.length > 0 && this.appendAll(e);
	}
	*[Symbol.iterator]() {
		yield* this.bufs;
	}
	get byteLength() {
		return this.length;
	}
	append(...e) {
		this.appendAll(e);
	}
	appendAll(e) {
		let t = 0;
		for (let n of e) if (n instanceof Uint8Array) t += n.byteLength, this.bufs.push(n);
		else if (bi(n)) {
			t += n.byteLength;
			for (let e of n.bufs) this.bufs.push(e);
		} else throw Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");
		this.length += t;
	}
	prepend(...e) {
		this.prependAll(e);
	}
	prependAll(e) {
		let t = 0;
		for (let n of e.reverse()) if (n instanceof Uint8Array) t += n.byteLength, this.bufs.unshift(n);
		else if (bi(n)) t += n.byteLength, this.bufs.unshift(...n.bufs);
		else throw Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
		this.length += t;
	}
	get(e) {
		let t = yi(this.bufs, e);
		return t.buf[t.index];
	}
	set(e, t) {
		let n = yi(this.bufs, e);
		n.buf[n.index] = t;
	}
	write(e, t = 0) {
		if (e instanceof Uint8Array) for (let n = 0; n < e.length; n++) this.set(t + n, e[n]);
		else if (bi(e)) for (let n = 0; n < e.length; n++) this.set(t + n, e.get(n));
		else throw Error("Could not write value, must be an Uint8Array or a Uint8ArrayList");
	}
	consume(e) {
		if (e = Math.trunc(e), !(Number.isNaN(e) || e <= 0)) {
			if (e === this.byteLength) this.bufs = [], this.length = 0;
			else for (; this.bufs.length > 0;) if (e >= this.bufs[0].byteLength) e -= this.bufs[0].byteLength, this.length -= this.bufs[0].byteLength, this.bufs.shift();
			else {
				this.bufs[0] = this.bufs[0].subarray(e), this.length -= e;
				break;
			}
		}
	}
	slice(e, t) {
		let { bufs: n, length: r } = this._subList(e, t);
		return gi(n, r);
	}
	subarray(e, t) {
		let { bufs: n, length: r } = this._subList(e, t);
		return n.length === 1 ? n[0] : gi(n, r);
	}
	sublist(t, n) {
		let { bufs: r, length: i } = this._subList(t, n), a = new e();
		return a.length = i, a.bufs = r, a;
	}
	_subList(e, t) {
		if (e ??= 0, t ??= this.length, e < 0 && (e = this.length + e), t < 0 && (t = this.length + t), e < 0 || t > this.length) throw RangeError("index is out of bounds");
		if (e === t) return {
			bufs: [],
			length: 0
		};
		if (e === 0 && t === this.length) return {
			bufs: [...this.bufs],
			length: this.length
		};
		let n = [], r = 0;
		for (let i = 0; i < this.bufs.length; i++) {
			let a = this.bufs[i], o = r, s = o + a.byteLength;
			if (r = s, e >= s) continue;
			let c = e >= o && e < s, l = t > o && t <= s;
			if (c && l) {
				if (e === o && t === s) {
					n.push(a);
					break;
				}
				let r = e - o;
				n.push(a.subarray(r, r + (t - e)));
				break;
			}
			if (c) {
				if (e === 0) {
					n.push(a);
					continue;
				}
				n.push(a.subarray(e - o));
			} else {
				if (l) {
					if (t === s) {
						n.push(a);
						break;
					}
					n.push(a.subarray(0, t - o));
					break;
				}
				n.push(a);
			}
		}
		return {
			bufs: n,
			length: t - e
		};
	}
	indexOf(e, t = 0) {
		if (!bi(e) && !(e instanceof Uint8Array)) throw TypeError("The \"value\" argument must be a Uint8ArrayList or Uint8Array");
		let n = e instanceof Uint8Array ? e : e.subarray();
		if (t = Number(t ?? 0), isNaN(t) && (t = 0), t < 0 && (t = this.length + t), t < 0 && (t = 0), e.length === 0) return t > this.length ? this.length : t;
		let r = n.byteLength;
		if (r === 0) throw TypeError("search must be at least 1 byte long");
		let i = /* @__PURE__ */ new Int32Array(256);
		for (let e = 0; e < 256; e++) i[e] = -1;
		for (let e = 0; e < r; e++) i[n[e]] = e;
		let a = i, o = this.byteLength - n.byteLength, s = n.byteLength - 1, c;
		for (let e = t; e <= o; e += c) {
			c = 0;
			for (let t = s; t >= 0; t--) {
				let r = this.get(e + t);
				if (n[t] !== r) {
					c = Math.max(1, t - a[r]);
					break;
				}
			}
			if (c === 0) return e;
		}
		return -1;
	}
	getInt8(e) {
		let t = this.subarray(e, e + 1);
		return new DataView(t.buffer, t.byteOffset, t.byteLength).getInt8(0);
	}
	setInt8(e, t) {
		let n = mi(1);
		new DataView(n.buffer, n.byteOffset, n.byteLength).setInt8(0, t), this.write(n, e);
	}
	getInt16(e, t) {
		let n = this.subarray(e, e + 2);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getInt16(0, t);
	}
	setInt16(e, t, n) {
		let r = pi(2);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setInt16(0, t, n), this.write(r, e);
	}
	getInt32(e, t) {
		let n = this.subarray(e, e + 4);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getInt32(0, t);
	}
	setInt32(e, t, n) {
		let r = pi(4);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setInt32(0, t, n), this.write(r, e);
	}
	getBigInt64(e, t) {
		let n = this.subarray(e, e + 8);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getBigInt64(0, t);
	}
	setBigInt64(e, t, n) {
		let r = pi(8);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setBigInt64(0, t, n), this.write(r, e);
	}
	getUint8(e) {
		let t = this.subarray(e, e + 1);
		return new DataView(t.buffer, t.byteOffset, t.byteLength).getUint8(0);
	}
	setUint8(e, t) {
		let n = mi(1);
		new DataView(n.buffer, n.byteOffset, n.byteLength).setUint8(0, t), this.write(n, e);
	}
	getUint16(e, t) {
		let n = this.subarray(e, e + 2);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getUint16(0, t);
	}
	setUint16(e, t, n) {
		let r = pi(2);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setUint16(0, t, n), this.write(r, e);
	}
	getUint32(e, t) {
		let n = this.subarray(e, e + 4);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getUint32(0, t);
	}
	setUint32(e, t, n) {
		let r = pi(4);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setUint32(0, t, n), this.write(r, e);
	}
	getBigUint64(e, t) {
		let n = this.subarray(e, e + 8);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getBigUint64(0, t);
	}
	setBigUint64(e, t, n) {
		let r = pi(8);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setBigUint64(0, t, n), this.write(r, e);
	}
	getFloat32(e, t) {
		let n = this.subarray(e, e + 4);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getFloat32(0, t);
	}
	setFloat32(e, t, n) {
		let r = pi(4);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setFloat32(0, t, n), this.write(r, e);
	}
	getFloat64(e, t) {
		let n = this.subarray(e, e + 8);
		return new DataView(n.buffer, n.byteOffset, n.byteLength).getFloat64(0, t);
	}
	setFloat64(e, t, n) {
		let r = pi(8);
		new DataView(r.buffer, r.byteOffset, r.byteLength).setFloat64(0, t, n), this.write(r, e);
	}
	equals(t) {
		if (t == null || !(t instanceof e) || t.bufs.length !== this.bufs.length) return !1;
		for (let e = 0; e < this.bufs.length; e++) if (!_i(this.bufs[e], t.bufs[e])) return !1;
		return !0;
	}
	static fromUint8Arrays(t, n) {
		let r = new e();
		return r.bufs = t, n ??= t.reduce((e, t) => e + t.byteLength, 0), r.length = n, r;
	}
}, Si = BigInt(34), Ci = 262144, wi = 1048576, Ti = (e = {}) => {
	let t = e.chunkSize ?? 262144;
	return async function* (e) {
		let n = new xi(), r = 0, i = !1;
		for await (let a of e) for (n.append(a), r += a.length; r >= t;) if (yield n.subarray(0, t), i = !0, t === n.length) n = new xi(), r = 0;
		else {
			let e = new xi();
			e.append(n.sublist(t)), n = e, r -= t;
		}
		(!i || r > 0) && (yield n.subarray(0, r));
	};
}, Ei = new TextDecoder();
function Di(e, t) {
	let n = 0;
	for (let r = 0;; r += 7) {
		/* c8 ignore next 3 */
		if (r >= 64) throw Error("protobuf: varint overflow");
		/* c8 ignore next 3 */
		if (t >= e.length) throw Error("protobuf: unexpected end of data");
		let i = e[t++];
		if (n += r < 28 ? (i & 127) << r : (i & 127) * 2 ** r, i < 128) break;
	}
	return [n, t];
}
function Oi(e, t) {
	let n;
	[n, t] = Di(e, t);
	let r = t + n;
	/* c8 ignore next 3 */
	if (n < 0 || r < 0) throw Error("protobuf: invalid length");
	/* c8 ignore next 3 */
	if (r > e.length) throw Error("protobuf: unexpected end of data");
	return [e.subarray(t, r), r];
}
function ki(e, t) {
	let n;
	return [n, t] = Di(e, t), [
		n & 7,
		n >> 3,
		t
	];
}
function Ai(e) {
	let t = {}, n = e.length, r = 0;
	for (; r < n;) {
		let n, i;
		if ([n, i, r] = ki(e, r), i === 1) {
			if (t.Hash) throw Error("protobuf: (PBLink) duplicate Hash section");
			if (n !== 2) throw Error(`protobuf: (PBLink) wrong wireType (${n}) for Hash`);
			if (t.Name !== void 0) throw Error("protobuf: (PBLink) invalid order, found Name before Hash");
			if (t.Tsize !== void 0) throw Error("protobuf: (PBLink) invalid order, found Tsize before Hash");
			[t.Hash, r] = Oi(e, r);
		} else if (i === 2) {
			if (t.Name !== void 0) throw Error("protobuf: (PBLink) duplicate Name section");
			if (n !== 2) throw Error(`protobuf: (PBLink) wrong wireType (${n}) for Name`);
			if (t.Tsize !== void 0) throw Error("protobuf: (PBLink) invalid order, found Tsize before Name");
			let i;
			[i, r] = Oi(e, r), t.Name = Ei.decode(i);
		} else if (i === 3) {
			if (t.Tsize !== void 0) throw Error("protobuf: (PBLink) duplicate Tsize section");
			if (n !== 0) throw Error(`protobuf: (PBLink) wrong wireType (${n}) for Tsize`);
			[t.Tsize, r] = Di(e, r);
		} else throw Error(`protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${i}`);
	}
	/* c8 ignore next 3 */
	if (r > n) throw Error("protobuf: (PBLink) unexpected end of data");
	return t;
}
function ji(e) {
	let t = e.length, n = 0, r, i = !1, a;
	for (; n < t;) {
		let t, o;
		if ([t, o, n] = ki(e, n), t !== 2) throw Error(`protobuf: (PBNode) invalid wireType, expected 2, got ${t}`);
		if (o === 1) {
			if (a) throw Error("protobuf: (PBNode) duplicate Data section");
			[a, n] = Oi(e, n), r && (i = !0);
		} else if (o === 2) {
			if (i) throw Error("protobuf: (PBNode) duplicate Links section");
			r ||= [];
			let t;
			[t, n] = Oi(e, n), r.push(Ai(t));
		} else throw Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${o}`);
	}
	/* c8 ignore next 3 */
	if (n > t) throw Error("protobuf: (PBNode) unexpected end of data");
	let o = {};
	return a && (o.Data = a), o.Links = r || [], o;
}
// node_modules/.pnpm/@ipld+dag-pb@4.2.0/node_modules/@ipld/dag-pb/src/pb-encode.js
var Mi = new TextEncoder(), Ni = 2 ** 32, Pi = 2 ** 31;
function Fi(e, t) {
	let n = t.length;
	if (typeof e.Tsize == "number") {
		if (e.Tsize < 0) throw Error("Tsize cannot be negative");
		if (!Number.isSafeInteger(e.Tsize)) throw Error("Tsize too large for encoding");
		n = Bi(t, n, e.Tsize) - 1, t[n] = 24;
	}
	if (typeof e.Name == "string") {
		let r = Mi.encode(e.Name);
		n -= r.length, t.set(r, n), n = Bi(t, n, r.length) - 1, t[n] = 18;
	}
	return e.Hash && (n -= e.Hash.length, t.set(e.Hash, n), n = Bi(t, n, e.Hash.length) - 1, t[n] = 10), t.length - n;
}
function Ii(e, t, n) {
	return e -= t.Data.length, n.set(t.Data, e), e = Bi(n, e, t.Data.length) - 1, n[e] = 10, e;
}
function Li(e, t) {
	let n = zi(e), r = new Uint8Array(n), i = n, a = t?.fieldOrder === "data-first" ? t.fieldOrder : "links-first";
	if (e.Data && a === "links-first" && (i = Ii(i, e, r)), e.Links) for (let t = e.Links.length - 1; t >= 0; t--) {
		let n = Fi(e.Links[t], r.subarray(0, i));
		i -= n, i = Bi(r, i, n) - 1, r[i] = 18;
	}
	return e.Data && a === "data-first" && (i = Ii(i, e, r)), r;
}
function Ri(e) {
	let t = 0;
	if (e.Hash) {
		let n = e.Hash.length;
		t += 1 + n + Vi(n);
	}
	if (typeof e.Name == "string") {
		let n = Mi.encode(e.Name).length;
		t += 1 + n + Vi(n);
	}
	return typeof e.Tsize == "number" && (t += 1 + Vi(e.Tsize)), t;
}
function zi(e) {
	let t = 0;
	if (e.Data) {
		let n = e.Data.length;
		t += 1 + n + Vi(n);
	}
	if (e.Links) for (let n of e.Links) {
		let e = Ri(n);
		t += 1 + e + Vi(e);
	}
	return t;
}
function Bi(e, t, n) {
	t -= Vi(n);
	let r = t;
	for (; n >= Pi;) e[t++] = n & 127 | 128, n /= 128;
	for (; n >= 128;) e[t++] = n & 127 | 128, n >>>= 7;
	return e[t] = n, r;
}
function Vi(e) {
	return e % 2 == 0 && e++, Math.floor((Hi(e) + 6) / 7);
}
function Hi(e) {
	let t = 0;
	return e >= Ni && (e = Math.floor(e / Ni), t = 32), e >= 65536 && (e >>>= 16, t += 16), e >= 256 && (e >>>= 8, t += 8), t + Ui[e];
}
var Ui = [
	0,
	1,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8
], Wi = ["Data", "Links"], Gi = [
	"Hash",
	"Name",
	"Tsize"
], Ki = new TextEncoder();
function qi(e, t) {
	if (e === t) return 0;
	let n = e.Name ? Ki.encode(e.Name) : [], r = t.Name ? Ki.encode(t.Name) : [], i = n.length, a = r.length;
	for (let e = 0, t = Math.min(i, a); e < t; ++e) if (n[e] !== r[e]) {
		i = n[e], a = r[e];
		break;
	}
	return i < a ? -1 : +(a < i);
}
function Ji(e, t) {
	return !Object.keys(e).some((e) => !t.includes(e));
}
function Yi(e) {
	if (typeof e.asCID == "object") {
		let t = br.asCID(e);
		if (!t) throw TypeError("Invalid DAG-PB form");
		return { Hash: t };
	}
	if (typeof e != "object" || Array.isArray(e)) throw TypeError("Invalid DAG-PB form");
	let t = {};
	if (e.Hash) {
		let n = br.asCID(e.Hash);
		try {
			n || (typeof e.Hash == "string" ? n = br.parse(e.Hash) : e.Hash instanceof Uint8Array && (n = br.decode(e.Hash)));
		} catch (e) {
			throw TypeError(`Invalid DAG-PB form: ${e.message}`);
		}
		n && (t.Hash = n);
	}
	if (!t.Hash) throw TypeError("Invalid DAG-PB form");
	return typeof e.Name == "string" && (t.Name = e.Name), typeof e.Tsize == "number" && (t.Tsize = e.Tsize), t;
}
function D(e) {
	if ((e instanceof Uint8Array || typeof e == "string") && (e = { Data: e }), typeof e != "object" || Array.isArray(e)) throw TypeError("Invalid DAG-PB form");
	let t = {};
	if (e.Data !== void 0) {
		if (typeof e.Data == "string") t.Data = Ki.encode(e.Data);
		else if (e.Data instanceof Uint8Array) t.Data = e.Data;
		else throw TypeError("Invalid DAG-PB form");
	}
	if (e.Links !== void 0) {
		if (Array.isArray(e.Links)) t.Links = e.Links.map(Yi), t.Links.sort(qi);
		else throw TypeError("Invalid DAG-PB form");
	} else t.Links = [];
	return t;
}
function Xi(e) {
	if (!e || typeof e != "object" || Array.isArray(e) || e instanceof Uint8Array || e["/"] && e["/"] === e.bytes) throw TypeError("Invalid DAG-PB form");
	if (!Ji(e, Wi)) throw TypeError("Invalid DAG-PB form (extraneous properties)");
	if (e.Data !== void 0 && !(e.Data instanceof Uint8Array)) throw TypeError("Invalid DAG-PB form (Data must be bytes)");
	if (!Array.isArray(e.Links)) throw TypeError("Invalid DAG-PB form (Links must be a list)");
	for (let t = 0; t < e.Links.length; t++) {
		let n = e.Links[t];
		if (!n || typeof n != "object" || Array.isArray(n) || n instanceof Uint8Array || n["/"] && n["/"] === n.bytes) throw TypeError("Invalid DAG-PB form (bad link)");
		if (!Ji(n, Gi)) throw TypeError("Invalid DAG-PB form (extraneous properties on link)");
		if (n.Hash === void 0) throw TypeError("Invalid DAG-PB form (link must have a Hash)");
		if (n.Hash == null || !n.Hash["/"] || n.Hash["/"] !== n.Hash.bytes) throw TypeError("Invalid DAG-PB form (link Hash must be a CID)");
		if (n.Name !== void 0 && typeof n.Name != "string") throw TypeError("Invalid DAG-PB form (link Name must be a string)");
		if (n.Tsize !== void 0) {
			if (typeof n.Tsize != "number" || n.Tsize % 1 != 0) throw TypeError("Invalid DAG-PB form (link Tsize must be an integer)");
			if (n.Tsize < 0) throw TypeError("Invalid DAG-PB form (link Tsize cannot be negative)");
		}
		if (t > 0 && qi(n, e.Links[t - 1]) === -1) throw TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)");
	}
}
function Zi(e, t = []) {
	return D({
		Data: e,
		Links: t
	});
}
function Qi(e, t, n) {
	return Yi({
		Hash: n,
		Name: e,
		Tsize: t
	});
}
function $i(e) {
	return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
// node_modules/.pnpm/@ipld+dag-pb@4.2.0/node_modules/@ipld/dag-pb/src/index.js
var ea = /* @__PURE__ */ c({
	code: () => 112,
	createLink: () => Qi,
	createNode: () => Zi,
	decode: () => k,
	encode: () => O,
	name: () => ta,
	prepare: () => D,
	validate: () => Xi
}), ta = "dag-pb";
function O(e, t) {
	Xi(e);
	let n = {};
	return e.Links && (n.Links = e.Links.map((e) => {
		let t = {};
		return e.Hash && (t.Hash = e.Hash.bytes), e.Name !== void 0 && (t.Name = e.Name), e.Tsize !== void 0 && (t.Tsize = e.Tsize), t;
	})), e.Data && (n.Data = e.Data), Li(n, t);
}
function k(e) {
	let t = ji($i(e)), n = {};
	return t.Data && (n.Data = t.Data), t.Links && (n.Links = t.Links.map((e) => {
		let t = {};
		try {
			t.Hash = br.decode(e.Hash);
		} catch {}
		if (!t.Hash) throw Error("Invalid Hash field found in link, expected CID");
		return e.Name !== void 0 && (t.Name = e.Name), e.Tsize !== void 0 && (t.Tsize = e.Tsize), t;
	})), n;
}
// node_modules/.pnpm/ipfs-unixfs@12.0.2/node_modules/ipfs-unixfs/dist/src/errors.js
var na = class e extends Error {
	static name = "InvalidTypeError";
	static code = "ERR_INVALID_TYPE";
	name = e.name;
	code = e.code;
	constructor(e = "Invalid type") {
		super(e);
	}
}, ra = 128, ia = 2 ** 14, aa = 2 ** 21, oa = 2 ** 28, sa = 2 ** 35, ca = 2 ** 42, la = 2 ** 49, A = 128, ua = 127;
function da(e) {
	if (e < ra) return 1;
	if (e < ia) return 2;
	if (e < aa) return 3;
	if (e < oa) return 4;
	if (e < sa) return 5;
	if (e < ca) return 6;
	if (e < la) return 7;
	if (e > 2 ** 53 - 1) throw RangeError("Could not encode varint");
	return 8;
}
function fa(e, t, n = 0) {
	switch (da(e)) {
		case 8: t[n++] = e & 255 | A, e /= 128;
		case 7: t[n++] = e & 255 | A, e /= 128;
		case 6: t[n++] = e & 255 | A, e /= 128;
		case 5: t[n++] = e & 255 | A, e /= 128;
		case 4: t[n++] = e & 255 | A, e >>>= 7;
		case 3: t[n++] = e & 255 | A, e >>>= 7;
		case 2: t[n++] = e & 255 | A, e >>>= 7;
		case 1:
			t[n++] = e & 255, e >>>= 7;
			break;
		default: throw Error("unreachable");
	}
	return t;
}
function pa(e, t) {
	let n = e[t], r = 0;
	if (r += n & ua, n < A || (n = e[t + 1], r += (n & ua) << 7, n < A) || (n = e[t + 2], r += (n & ua) << 14, n < A) || (n = e[t + 3], r += (n & ua) << 21, n < A) || (n = e[t + 4], r += (n & ua) * oa, n < A) || (n = e[t + 5], r += (n & ua) * sa, n < A) || (n = e[t + 6], r += (n & ua) * ca, n < A) || (n = e[t + 7], r += (n & ua) * la, n < A)) return r;
	throw RangeError("Could not decode varint");
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/utils/float.js
var ma = new Float32Array([-0]), ha = new Uint8Array(ma.buffer);
function ga(e, t, n) {
	ma[0] = e, t[n] = ha[0], t[n + 1] = ha[1], t[n + 2] = ha[2], t[n + 3] = ha[3];
}
function _a(e, t) {
	return ha[0] = e[t], ha[1] = e[t + 1], ha[2] = e[t + 2], ha[3] = e[t + 3], ma[0];
}
var va = new Float64Array([-0]), j = new Uint8Array(va.buffer);
function ya(e, t, n) {
	va[0] = e, t[n] = j[0], t[n + 1] = j[1], t[n + 2] = j[2], t[n + 3] = j[3], t[n + 4] = j[4], t[n + 5] = j[5], t[n + 6] = j[6], t[n + 7] = j[7];
}
function ba(e, t) {
	return j[0] = e[t], j[1] = e[t + 1], j[2] = e[t + 2], j[3] = e[t + 3], j[4] = e[t + 4], j[5] = e[t + 5], j[6] = e[t + 6], j[7] = e[t + 7], va[0];
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/utils/longbits.js
var xa = BigInt(2 ** 53 - 1), Sa = BigInt(-(2 ** 53 - 1)), Ca = class e {
	lo;
	hi;
	constructor(e, t) {
		this.lo = e | 0, this.hi = t | 0;
	}
	toNumber(e = !1) {
		if (!e && this.hi >>> 31 > 0) {
			let e = ~this.lo + 1 >>> 0, t = ~this.hi >>> 0;
			return e === 0 && (t = t + 1 >>> 0), -(e + t * 4294967296);
		}
		return this.lo + this.hi * 4294967296;
	}
	toBigInt(e = !1) {
		if (e) return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
		if (this.hi >>> 31) {
			let e = ~this.lo + 1 >>> 0, t = ~this.hi >>> 0;
			return e === 0 && (t = t + 1 >>> 0), -(BigInt(e) + (BigInt(t) << 32n));
		}
		return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
	}
	toString(e = !1) {
		return this.toBigInt(e).toString();
	}
	zzEncode() {
		let e = this.hi >> 31;
		return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0, this.lo = (this.lo << 1 ^ e) >>> 0, this;
	}
	zzDecode() {
		let e = -(this.lo & 1);
		return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0, this.hi = (this.hi >>> 1 ^ e) >>> 0, this;
	}
	length() {
		let e = this.lo, t = (this.lo >>> 28 | this.hi << 4) >>> 0, n = this.hi >>> 24;
		return n === 0 ? t === 0 ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : t < 16384 ? t < 128 ? 5 : 6 : t < 2097152 ? 7 : 8 : n < 128 ? 9 : 10;
	}
	static fromBigInt(t) {
		if (t === 0n) return wa;
		if (t < xa && t > Sa) return this.fromNumber(Number(t));
		let n = t < 0n;
		n && (t = -t);
		let r = t >> 32n, i = t - (r << 32n);
		return n && (r = ~r | 0n, i = ~i | 0n, ++i > Ta && (i = 0n, ++r > Ta && (r = 0n))), new e(Number(i), Number(r));
	}
	static fromNumber(t) {
		if (t === 0) return wa;
		let n = t < 0;
		n && (t = -t);
		let r = t >>> 0, i = (t - r) / 4294967296 >>> 0;
		return n && (i = ~i >>> 0, r = ~r >>> 0, ++r > 4294967295 && (r = 0, ++i > 4294967295 && (i = 0))), new e(r, i);
	}
	static from(t) {
		return typeof t == "number" ? e.fromNumber(t) : typeof t == "bigint" ? e.fromBigInt(t) : typeof t == "string" ? e.fromBigInt(BigInt(t)) : t.low != null || t.high != null ? new e(t.low >>> 0, t.high >>> 0) : wa;
	}
}, wa = new Ca(0, 0);
wa.toBigInt = function() {
	return 0n;
}, wa.zzEncode = wa.zzDecode = function() {
	return this;
}, wa.length = function() {
	return 1;
};
var Ta = 4294967296n;
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/utils/utf8.js
function Ea(e) {
	let t = 0, n = 0;
	for (let r = 0; r < e.length; ++r) n = e.charCodeAt(r), n < 128 ? t += 1 : n < 2048 ? t += 2 : (n & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 ? (++r, t += 4) : t += 3;
	return t;
}
function Da(e, t, n) {
	if (n - t < 1) return "";
	let r, i = [], a = 0, o;
	for (; t < n;) o = e[t++], o < 128 ? i[a++] = o : o > 191 && o < 224 ? i[a++] = (o & 31) << 6 | e[t++] & 63 : o > 239 && o < 365 ? (o = ((o & 7) << 18 | (e[t++] & 63) << 12 | (e[t++] & 63) << 6 | e[t++] & 63) - 65536, i[a++] = 55296 + (o >> 10), i[a++] = 56320 + (o & 1023)) : i[a++] = (o & 15) << 12 | (e[t++] & 63) << 6 | e[t++] & 63, a > 8191 && ((r ??= []).push(String.fromCharCode.apply(String, i)), a = 0);
	return r == null ? String.fromCharCode.apply(String, i.slice(0, a)) : (a > 0 && r.push(String.fromCharCode.apply(String, i.slice(0, a))), r.join(""));
}
function Oa(e, t, n) {
	let r = n, i, a;
	for (let r = 0; r < e.length; ++r) i = e.charCodeAt(r), i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) == 55296 && ((a = e.charCodeAt(r + 1)) & 64512) == 56320 ? (i = 65536 + ((i & 1023) << 10) + (a & 1023), ++r, t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128);
	return n - r;
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/utils/reader.js
/* istanbul ignore next */
function ka(e, t) {
	return RangeError(`index out of range: ${e.pos} + ${t ?? 1} > ${e.len}`);
}
function Aa(e, t) {
	return (e[t - 4] | e[t - 3] << 8 | e[t - 2] << 16 | e[t - 1] << 24) >>> 0;
}
var ja = class {
	buf;
	pos;
	len;
	_slice = Uint8Array.prototype.subarray;
	constructor(e) {
		this.buf = e, this.pos = 0, this.len = e.length;
	}
	uint32() {
		let e = 4294967295;
		if (e = (this.buf[this.pos] & 127) >>> 0, this.buf[this.pos++] < 128 || (e = (e | (this.buf[this.pos] & 127) << 7) >>> 0, this.buf[this.pos++] < 128) || (e = (e | (this.buf[this.pos] & 127) << 14) >>> 0, this.buf[this.pos++] < 128) || (e = (e | (this.buf[this.pos] & 127) << 21) >>> 0, this.buf[this.pos++] < 128) || (e = (e | (this.buf[this.pos] & 15) << 28) >>> 0, this.buf[this.pos++] < 128)) return e;
		if ((this.pos += 5) > this.len) throw this.pos = this.len, ka(this, 10);
		return e;
	}
	int32() {
		return this.uint32() | 0;
	}
	sint32() {
		let e = this.uint32();
		return e >>> 1 ^ -(e & 1);
	}
	bool() {
		return this.uint32() !== 0;
	}
	fixed32() {
		if (this.pos + 4 > this.len) throw ka(this, 4);
		return Aa(this.buf, this.pos += 4);
	}
	sfixed32() {
		if (this.pos + 4 > this.len) throw ka(this, 4);
		return Aa(this.buf, this.pos += 4) | 0;
	}
	float() {
		if (this.pos + 4 > this.len) throw ka(this, 4);
		let e = _a(this.buf, this.pos);
		return this.pos += 4, e;
	}
	double() {
		/* istanbul ignore if */
		if (this.pos + 8 > this.len) throw ka(this, 4);
		let e = ba(this.buf, this.pos);
		return this.pos += 8, e;
	}
	bytes() {
		let e = this.uint32(), t = this.pos, n = this.pos + e;
		/* istanbul ignore if */
		if (n > this.len) throw ka(this, e);
		return this.pos += e, t === n ? /* @__PURE__ */ new Uint8Array() : this.buf.subarray(t, n);
	}
	string() {
		let e = this.bytes();
		return Da(e, 0, e.length);
	}
	skip(e) {
		if (typeof e == "number") {
			/* istanbul ignore if */
			if (this.pos + e > this.len) throw ka(this, e);
			this.pos += e;
		} else do
			/* istanbul ignore if */
			if (this.pos >= this.len) throw ka(this);
		while (this.buf[this.pos++] & 128);
		return this;
	}
	skipType(e) {
		switch (e) {
			case 0:
				this.skip();
				break;
			case 1:
				this.skip(8);
				break;
			case 2:
				this.skip(this.uint32());
				break;
			case 3:
				for (; (e = this.uint32() & 7) != 4;) this.skipType(e);
				break;
			case 5:
				this.skip(4);
				break;
			/* istanbul ignore next */
			default: throw Error(`invalid wire type ${e} at offset ${this.pos}`);
		}
		return this;
	}
	readLongVarint() {
		let e = new Ca(0, 0), t = 0;
		if (this.len - this.pos > 4) {
			for (; t < 4; ++t) if (e.lo = (e.lo | (this.buf[this.pos] & 127) << t * 7) >>> 0, this.buf[this.pos++] < 128) return e;
			if (e.lo = (e.lo | (this.buf[this.pos] & 127) << 28) >>> 0, e.hi = (e.hi | (this.buf[this.pos] & 127) >> 4) >>> 0, this.buf[this.pos++] < 128) return e;
			t = 0;
		} else {
			for (; t < 3; ++t) {
				/* istanbul ignore if */
				if (this.pos >= this.len) throw ka(this);
				if (e.lo = (e.lo | (this.buf[this.pos] & 127) << t * 7) >>> 0, this.buf[this.pos++] < 128) return e;
			}
			return e.lo = (e.lo | (this.buf[this.pos++] & 127) << t * 7) >>> 0, e;
		}
		if (this.len - this.pos > 4) {
			for (; t < 5; ++t) if (e.hi = (e.hi | (this.buf[this.pos] & 127) << t * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return e;
		} else for (; t < 5; ++t) {
			if (this.pos >= this.len) throw ka(this);
			if (e.hi = (e.hi | (this.buf[this.pos] & 127) << t * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return e;
		}
		throw Error("invalid varint encoding");
	}
	readFixed64() {
		if (this.pos + 8 > this.len) throw ka(this, 8);
		return new Ca(Aa(this.buf, this.pos += 4), Aa(this.buf, this.pos += 4));
	}
	int64() {
		return this.readLongVarint().toBigInt();
	}
	int64Number() {
		return this.readLongVarint().toNumber();
	}
	int64String() {
		return this.readLongVarint().toString();
	}
	uint64() {
		return this.readLongVarint().toBigInt(!0);
	}
	uint64Number() {
		let e = pa(this.buf, this.pos);
		return this.pos += da(e), e;
	}
	uint64String() {
		return this.readLongVarint().toString(!0);
	}
	sint64() {
		return this.readLongVarint().zzDecode().toBigInt();
	}
	sint64Number() {
		return this.readLongVarint().zzDecode().toNumber();
	}
	sint64String() {
		return this.readLongVarint().zzDecode().toString();
	}
	fixed64() {
		return this.readFixed64().toBigInt();
	}
	fixed64Number() {
		return this.readFixed64().toNumber();
	}
	fixed64String() {
		return this.readFixed64().toString();
	}
	sfixed64() {
		return this.readFixed64().toBigInt();
	}
	sfixed64Number() {
		return this.readFixed64().toNumber();
	}
	sfixed64String() {
		return this.readFixed64().toString();
	}
};
function Ma(e) {
	return new ja(e instanceof Uint8Array ? e : e.subarray());
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/decode.js
function Na(e, t, n) {
	let r = Ma(e);
	return t.decode(r, void 0, n);
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/bytes.js
function Pa(e, t) {
	if (e === t) return !0;
	if (e.byteLength !== t.byteLength) return !1;
	for (let n = 0; n < e.byteLength; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function Fa(e) {
	if (e instanceof Uint8Array && e.constructor.name === "Uint8Array") return e;
	if (e instanceof ArrayBuffer) return new Uint8Array(e);
	if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	throw Error("Unknown type, must be binary type");
}
function Ia(e) {
	return new TextEncoder().encode(e);
}
function La(e) {
	return new TextDecoder().decode(e);
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/vendor/base-x.js
function Ra(e, t) {
	if (e.length >= 255) throw TypeError("Alphabet too long");
	for (var n = /* @__PURE__ */ new Uint8Array(256), r = 0; r < n.length; r++) n[r] = 255;
	for (var i = 0; i < e.length; i++) {
		var a = e.charAt(i), o = a.charCodeAt(0);
		if (n[o] !== 255) throw TypeError(a + " is ambiguous");
		n[o] = i;
	}
	var s = e.length, c = e.charAt(0), l = Math.log(s) / Math.log(256), u = Math.log(256) / Math.log(s);
	function d(t) {
		if (t instanceof Uint8Array || (ArrayBuffer.isView(t) ? t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : Array.isArray(t) && (t = Uint8Array.from(t))), !(t instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
		if (t.length === 0) return "";
		for (var n = 0, r = 0, i = 0, a = t.length; i !== a && t[i] === 0;) i++, n++;
		for (var o = (a - i) * u + 1 >>> 0, l = new Uint8Array(o); i !== a;) {
			for (var d = t[i], f = 0, p = o - 1; (d !== 0 || f < r) && p !== -1; p--, f++) d += 256 * l[p] >>> 0, l[p] = d % s >>> 0, d = d / s >>> 0;
			if (d !== 0) throw Error("Non-zero carry");
			r = f, i++;
		}
		for (var m = o - r; m !== o && l[m] === 0;) m++;
		for (var h = c.repeat(n); m < o; ++m) h += e.charAt(l[m]);
		return h;
	}
	function f(e) {
		if (typeof e != "string") throw TypeError("Expected String");
		if (e.length === 0) return /* @__PURE__ */ new Uint8Array();
		var t = 0;
		if (e[t] !== " ") {
			for (var r = 0, i = 0; e[t] === c;) r++, t++;
			for (var a = (e.length - t) * l + 1 >>> 0, o = new Uint8Array(a); e[t];) {
				var u = n[e.charCodeAt(t)];
				if (u === 255) return;
				for (var d = 0, f = a - 1; (u !== 0 || d < i) && f !== -1; f--, d++) u += s * o[f] >>> 0, o[f] = u % 256 >>> 0, u = u / 256 >>> 0;
				if (u !== 0) throw Error("Non-zero carry");
				i = d, t++;
			}
			if (e[t] !== " ") {
				for (var p = a - i; p !== a && o[p] === 0;) p++;
				for (var m = new Uint8Array(r + (a - p)), h = r; p !== a;) m[h++] = o[p++];
				return m;
			}
		}
	}
	function p(e) {
		var n = f(e);
		if (n) return n;
		throw Error(`Non-${t} character`);
	}
	return {
		encode: d,
		decodeUnsafe: f,
		decode: p
	};
}
var za = Ra, Ba = class {
	name;
	prefix;
	baseEncode;
	constructor(e, t, n) {
		this.name = e, this.prefix = t, this.baseEncode = n;
	}
	encode(e) {
		if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
		throw Error("Unknown type, must be binary type");
	}
}, Va = class {
	name;
	prefix;
	baseDecode;
	prefixCodePoint;
	constructor(e, t, n) {
		this.name = e, this.prefix = t;
		let r = t.codePointAt(0);
		/* c8 ignore next 3 */
		if (r === void 0) throw Error("Invalid prefix character");
		this.prefixCodePoint = r, this.baseDecode = n;
	}
	decode(e) {
		if (typeof e == "string") {
			if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(e.slice(this.prefix.length));
		}
		throw Error("Can only multibase decode strings");
	}
	or(e) {
		return Ua(this, e);
	}
}, Ha = class {
	decoders;
	constructor(e) {
		this.decoders = e;
	}
	or(e) {
		return Ua(this, e);
	}
	decode(e) {
		let t = e[0], n = this.decoders[t];
		if (n != null) return n.decode(e);
		throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
function Ua(e, t) {
	return new Ha({
		...e.decoders ?? { [e.prefix]: e },
		...t.decoders ?? { [t.prefix]: t }
	});
}
var Wa = class {
	name;
	prefix;
	baseEncode;
	baseDecode;
	encoder;
	decoder;
	constructor(e, t, n, r) {
		this.name = e, this.prefix = t, this.baseEncode = n, this.baseDecode = r, this.encoder = new Ba(e, t, n), this.decoder = new Va(e, t, r);
	}
	encode(e) {
		return this.encoder.encode(e);
	}
	decode(e) {
		return this.decoder.decode(e);
	}
};
function Ga({ name: e, prefix: t, encode: n, decode: r }) {
	return new Wa(e, t, n, r);
}
function Ka({ name: e, prefix: t, alphabet: n }) {
	let { encode: r, decode: i } = za(n, e);
	return Ga({
		prefix: t,
		name: e,
		encode: r,
		decode: (e) => Fa(i(e))
	});
}
function qa(e, t, n, r) {
	let i = e.length;
	for (; e[i - 1] === "=";) --i;
	let a = new Uint8Array(i * n / 8 | 0), o = 0, s = 0, c = 0;
	for (let l = 0; l < i; ++l) {
		let i = t[e[l]];
		if (i === void 0) throw SyntaxError(`Non-${r} character`);
		s = s << n | i, o += n, o >= 8 && (o -= 8, a[c++] = 255 & s >> o);
	}
	if (o >= n || 255 & s << 8 - o) throw SyntaxError("Unexpected end of data");
	return a;
}
function Ja(e, t, n) {
	let r = t[t.length - 1] === "=", i = (1 << n) - 1, a = "", o = 0, s = 0;
	for (let r = 0; r < e.length; ++r) for (s = s << 8 | e[r], o += 8; o > n;) o -= n, a += t[i & s >> o];
	if (o !== 0 && (a += t[i & s << n - o]), r) for (; a.length * n & 7;) a += "=";
	return a;
}
function Ya(e) {
	let t = {};
	for (let n = 0; n < e.length; ++n) t[e[n]] = n;
	return t;
}
function M({ name: e, prefix: t, bitsPerChar: n, alphabet: r }) {
	let i = Ya(r);
	return Ga({
		prefix: t,
		name: e,
		encode(e) {
			return Ja(e, r, n);
		},
		decode(t) {
			return qa(t, i, n, e);
		}
	});
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/bases/base10.js
var Xa = /* @__PURE__ */ c({ base10: () => Za }), Za = Ka({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
}), Qa = /* @__PURE__ */ c({
	base16: () => $a,
	base16upper: () => eo
}), $a = M({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4
}), eo = M({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4
}), to = /* @__PURE__ */ c({ base2: () => no }), no = M({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
}), ro = /* @__PURE__ */ c({ base256emoji: () => lo }), io = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), ao = io.reduce((e, t, n) => (e[n] = t, e), []), oo = io.reduce((e, t, n) => {
	let r = t.codePointAt(0);
	if (r == null) throw Error(`Invalid character: ${t}`);
	return e[r] = n, e;
}, []);
function so(e) {
	return e.reduce((e, t) => (e += ao[t], e), "");
}
function co(e) {
	let t = [];
	for (let n of e) {
		let e = n.codePointAt(0);
		if (e == null) throw Error(`Invalid character: ${n}`);
		let r = oo[e];
		if (r == null) throw Error(`Non-base256emoji character: ${n}`);
		t.push(r);
	}
	return new Uint8Array(t);
}
var lo = Ga({
	prefix: "🚀",
	name: "base256emoji",
	encode: so,
	decode: co
}), uo = /* @__PURE__ */ c({
	base32: () => fo,
	base32hex: () => go,
	base32hexpad: () => vo,
	base32hexpadupper: () => yo,
	base32hexupper: () => _o,
	base32pad: () => mo,
	base32padupper: () => ho,
	base32upper: () => po,
	base32z: () => bo
}), fo = M({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5
}), po = M({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5
}), mo = M({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5
}), ho = M({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5
}), go = M({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5
}), _o = M({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5
}), vo = M({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5
}), yo = M({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5
}), bo = M({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
}), xo = /* @__PURE__ */ c({
	base36: () => So,
	base36upper: () => Co
}), So = Ka({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
}), Co = Ka({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
}), wo = /* @__PURE__ */ c({
	base58btc: () => To,
	base58flickr: () => Eo
}), To = Ka({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
}), Eo = Ka({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
}), Do = /* @__PURE__ */ c({
	base64: () => Oo,
	base64pad: () => ko,
	base64url: () => Ao,
	base64urlpad: () => jo
}), Oo = M({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
}), ko = M({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
}), Ao = M({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
}), jo = M({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
}), Mo = /* @__PURE__ */ c({ base8: () => No }), No = M({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
}), Po = /* @__PURE__ */ c({ identity: () => Fo }), Fo = Ga({
	prefix: "\0",
	name: "identity",
	encode: (e) => La(e),
	decode: (e) => Ia(e)
});
new TextEncoder();
var Io = new TextDecoder();
function Lo(e) {
	return JSON.parse(Io.decode(e));
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/codecs/raw.js
var Ro = /* @__PURE__ */ c({
	code: () => 85,
	decode: () => Bo,
	encode: () => zo,
	name: () => "raw"
});
function zo(e) {
	return Fa(e);
}
function Bo(e) {
	return Fa(e);
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/vendor/varint.js
var Vo = Go, Ho = 128, Uo = -128, Wo = 2 ** 31;
function Go(e, t, n) {
	t ||= [], n ||= 0;
	for (var r = n; e >= Wo;) t[n++] = e & 255 | Ho, e /= 128;
	for (; e & Uo;) t[n++] = e & 255 | Ho, e >>>= 7;
	return t[n] = e | 0, Go.bytes = n - r + 1, t;
}
var Ko = Yo, qo = 128, Jo = 127;
function Yo(e, t) {
	var n = 0, t = t || 0, r = 0, i = t, a, o = e.length;
	do {
		if (i >= o) throw Yo.bytes = 0, RangeError("Could not decode varint");
		a = e[i++], n += r < 28 ? (a & Jo) << r : (a & Jo) * 2 ** r, r += 7;
	} while (a >= qo);
	return Yo.bytes = i - t, n;
}
var Xo = 128, Zo = 2 ** 14, Qo = 2 ** 21, $o = 2 ** 28, es = 2 ** 35, ts = 2 ** 42, ns = 2 ** 49, rs = 2 ** 56, is = 2 ** 63, as = {
	encode: Vo,
	decode: Ko,
	encodingLength: function(e) {
		return e < Xo ? 1 : e < Zo ? 2 : e < Qo ? 3 : e < $o ? 4 : e < es ? 5 : e < ts ? 6 : e < ns ? 7 : e < rs ? 8 : e < is ? 9 : 10;
	}
};
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/varint.js
function os(e, t = 0) {
	return [as.decode(e, t), as.decode.bytes];
}
function ss(e, t, n = 0) {
	return as.encode(e, t, n), t;
}
function cs(e) {
	return as.encodingLength(e);
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/hashes/digest.js
function ls(e, t) {
	let n = t.byteLength, r = cs(e), i = r + cs(n), a = new Uint8Array(i + n);
	return ss(e, a, 0), ss(n, a, r), a.set(t, i), new fs(e, n, t, a);
}
function us(e) {
	let t = Fa(e), [n, r] = os(t), [i, a] = os(t.subarray(r)), o = t.subarray(r + a);
	if (o.byteLength !== i) throw Error("Incorrect length");
	return new fs(n, i, o, t);
}
function ds(e, t) {
	if (e === t) return !0;
	{
		let n = t;
		return e.code === n.code && e.size === n.size && n.bytes instanceof Uint8Array && Pa(e.bytes, n.bytes);
	}
}
var fs = class {
	code;
	size;
	digest;
	bytes;
	constructor(e, t, n, r) {
		this.code = e, this.size = t, this.digest = n, this.bytes = r;
	}
}, ps = /* @__PURE__ */ c({ identity: () => vs }), ms = 0, hs = "identity", gs = Fa;
function _s(e, t) {
	if (t?.truncate != null && t.truncate !== e.byteLength) {
		if (t.truncate < 0 || t.truncate > e.byteLength) throw Error(`Invalid truncate option, must be less than or equal to ${e.byteLength}`);
		e = e.subarray(0, t.truncate);
	}
	return ls(ms, gs(e));
}
var vs = {
	code: ms,
	name: hs,
	encode: gs,
	digest: _s
}, ys = 20;
function bs({ name: e, code: t, encode: n, minDigestLength: r, maxDigestLength: i }) {
	return new xs(e, t, n, r, i);
}
var xs = class {
	name;
	code;
	encode;
	minDigestLength;
	maxDigestLength;
	constructor(e, t, n, r, i) {
		this.name = e, this.code = t, this.encode = n, this.minDigestLength = r ?? ys, this.maxDigestLength = i;
	}
	digest(e, t) {
		if (t?.truncate != null) {
			if (t.truncate < this.minDigestLength) throw Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
			if (this.maxDigestLength != null && t.truncate > this.maxDigestLength) throw Error(`Invalid truncate option, must be less than or equal to ${this.maxDigestLength}`);
		}
		if (e instanceof Uint8Array) {
			let n = this.encode(e);
			return n instanceof Uint8Array ? Ss(n, this.code, t?.truncate) : n.then((e) => Ss(e, this.code, t?.truncate));
		}
		throw Error("Unknown type, must be binary type");
	}
};
function Ss(e, t, n) {
	if (n != null && n !== e.byteLength) {
		if (n > e.byteLength) throw Error(`Invalid truncate option, must be less than or equal to ${e.byteLength}`);
		e = e.subarray(0, n);
	}
	return ls(t, e);
}
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/hashes/sha2-browser.js
var Cs = /* @__PURE__ */ c({
	sha256: () => Ts,
	sha512: () => Es
});
function ws(e) {
	return async (t) => new Uint8Array(await crypto.subtle.digest(e, t));
}
var Ts = bs({
	name: "sha2-256",
	code: 18,
	encode: ws("SHA-256")
}), Es = bs({
	name: "sha2-512",
	code: 19,
	encode: ws("SHA-512")
});
// node_modules/.pnpm/multiformats@13.4.2/node_modules/multiformats/dist/src/cid.js
function Ds(e, t) {
	let { bytes: n, version: r } = e;
	switch (r) {
		case 0: return js(n, ks(e), t ?? To.encoder);
		default: return Ms(n, ks(e), t ?? fo.encoder);
	}
}
var Os = /* @__PURE__ */ new WeakMap();
function ks(e) {
	let t = Os.get(e);
	if (t == null) {
		let t = /* @__PURE__ */ new Map();
		return Os.set(e, t), t;
	}
	return t;
}
var N = class e {
	code;
	version;
	multihash;
	bytes;
	"/";
	constructor(e, t, n, r) {
		this.code = t, this.version = e, this.multihash = n, this.bytes = r, this["/"] = r;
	}
	get asCID() {
		return this;
	}
	get byteOffset() {
		return this.bytes.byteOffset;
	}
	get byteLength() {
		return this.bytes.byteLength;
	}
	toV0() {
		switch (this.version) {
			case 0: return this;
			case 1: {
				let { code: t, multihash: n } = this;
				if (t !== Ns) throw Error("Cannot convert a non dag-pb CID to CIDv0");
				if (n.code !== Ps) throw Error("Cannot convert non sha2-256 multihash CID to CIDv0");
				return e.createV0(n);
			}
			default: throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
		}
	}
	toV1() {
		switch (this.version) {
			case 0: {
				let { code: t, digest: n } = this.multihash, r = ls(t, n);
				return e.createV1(this.code, r);
			}
			case 1: return this;
			default: throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
		}
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		let n = t;
		return n != null && e.code === n.code && e.version === n.version && ds(e.multihash, n.multihash);
	}
	toString(e) {
		return Ds(this, e);
	}
	toJSON() {
		return { "/": Ds(this) };
	}
	link() {
		return this;
	}
	[Symbol.toStringTag] = "CID";
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return `CID(${this.toString()})`;
	}
	static asCID(t) {
		if (t == null) return null;
		let n = t;
		if (n instanceof e) return n;
		if (n["/"] != null && n["/"] === n.bytes || n.asCID === n) {
			let { version: t, code: r, multihash: i, bytes: a } = n;
			return new e(t, r, i, a ?? Fs(t, r, i.bytes));
		}
		if (n[Is] === !0) {
			let { version: t, multihash: r, code: i } = n, a = us(r);
			return e.create(t, i, a);
		}
		return null;
	}
	static create(t, n, r) {
		if (typeof n != "number") throw Error("String codecs are no longer supported");
		if (!(r.bytes instanceof Uint8Array)) throw Error("Invalid digest");
		switch (t) {
			case 0:
				if (n !== Ns) throw Error(`Version 0 CID must use dag-pb (code: ${Ns}) block encoding`);
				return new e(t, n, r, r.bytes);
			case 1: {
				let i = Fs(t, n, r.bytes);
				return new e(t, n, r, i);
			}
			default: throw Error("Invalid version");
		}
	}
	static createV0(t) {
		return e.create(0, Ns, t);
	}
	static createV1(t, n) {
		return e.create(1, t, n);
	}
	static decode(t) {
		let [n, r] = e.decodeFirst(t);
		if (r.length !== 0) throw Error("Incorrect length");
		return n;
	}
	static decodeFirst(t) {
		let n = e.inspectBytes(t), r = n.size - n.multihashSize, i = Fa(t.subarray(r, r + n.multihashSize));
		if (i.byteLength !== n.multihashSize) throw Error("Incorrect length");
		let a = i.subarray(n.multihashSize - n.digestSize), o = new fs(n.multihashCode, n.digestSize, a, i);
		return [n.version === 0 ? e.createV0(o) : e.createV1(n.codec, o), t.subarray(n.size)];
	}
	static inspectBytes(e) {
		let t = 0, n = () => {
			let [n, r] = os(e.subarray(t));
			return t += r, n;
		}, r = n(), i = Ns;
		if (r === 18 ? (r = 0, t = 0) : i = n(), r !== 0 && r !== 1) throw RangeError(`Invalid CID version ${r}`);
		let a = t, o = n(), s = n(), c = t + s, l = c - a;
		return {
			version: r,
			codec: i,
			multihashCode: o,
			digestSize: s,
			multihashSize: l,
			size: c
		};
	}
	static parse(t, n) {
		let [r, i] = As(t, n), a = e.decode(i);
		if (a.version === 0 && t[0] !== "Q") throw Error("Version 0 CID string must not include multibase prefix");
		return ks(a).set(r, t), a;
	}
};
function As(e, t) {
	switch (e[0]) {
		case "Q": {
			let n = t ?? To;
			return [To.prefix, n.decode(`${To.prefix}${e}`)];
		}
		case To.prefix: {
			let n = t ?? To;
			return [To.prefix, n.decode(e)];
		}
		case fo.prefix: {
			let n = t ?? fo;
			return [fo.prefix, n.decode(e)];
		}
		case So.prefix: {
			let n = t ?? So;
			return [So.prefix, n.decode(e)];
		}
		default:
			if (t == null) throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
			return [e[0], t.decode(e)];
	}
}
function js(e, t, n) {
	let { prefix: r } = n;
	if (r !== To.prefix) throw Error(`Cannot string encode V0 in ${n.name} encoding`);
	let i = t.get(r);
	if (i == null) {
		let i = n.encode(e).slice(1);
		return t.set(r, i), i;
	}
	return i;
}
function Ms(e, t, n) {
	let { prefix: r } = n, i = t.get(r);
	if (i == null) {
		let i = n.encode(e);
		return t.set(r, i), i;
	}
	return i;
}
var Ns = 112, Ps = 18;
function Fs(e, t, n) {
	let r = cs(e), i = r + cs(t), a = new Uint8Array(i + n.byteLength);
	return ss(e, a, 0), ss(t, a, r), a.set(n, i), a;
}
var Is = Symbol.for("@ipld/js-cid/CID"), Ls = {
	...Po,
	...to,
	...Mo,
	...Xa,
	...Qa,
	...uo,
	...xo,
	...wo,
	...Do,
	...ro
};
({
	...Cs,
	...ps
});
// node_modules/.pnpm/uint8arrays@5.1.1/node_modules/uint8arrays/dist/src/util/bases.js
function Rs(e, t, n, r) {
	return {
		name: e,
		prefix: t,
		encoder: {
			name: e,
			prefix: t,
			encode: n
		},
		decoder: { decode: r }
	};
}
var zs = Rs("utf8", "u", (e) => "u" + new TextDecoder("utf8").decode(e), (e) => new TextEncoder().encode(e.substring(1))), Bs = Rs("ascii", "a", (e) => {
	let t = "a";
	for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
	return t;
}, (e) => {
	e = e.substring(1);
	let t = mi(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	return t;
}), Vs = {
	utf8: zs,
	"utf-8": zs,
	hex: Ls.base16,
	latin1: Bs,
	ascii: Bs,
	binary: Bs,
	...Ls
};
// node_modules/.pnpm/uint8arrays@5.1.1/node_modules/uint8arrays/dist/src/from-string.js
function Hs(e, t = "utf8") {
	let n = Vs[t];
	if (n == null) throw Error(`Unsupported encoding "${t}"`);
	return n.decoder.decode(`${n.prefix}${e}`);
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/utils/pool.js
function Us(e) {
	let t = e ?? 8192, n = t >>> 1, r, i = t;
	return function(e) {
		if (e < 1 || e > n) return mi(e);
		i + e > t && (r = mi(t), i = 0);
		let a = r.subarray(i, i += e);
		return i & 7 && (i = (i | 7) + 1), a;
	};
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/utils/writer.js
var Ws = class {
	fn;
	len;
	next;
	val;
	constructor(e, t, n) {
		this.fn = e, this.len = t, this.next = void 0, this.val = n;
	}
};
/* istanbul ignore next */
function Gs() {}
var Ks = class {
	head;
	tail;
	len;
	next;
	constructor(e) {
		this.head = e.head, this.tail = e.tail, this.len = e.len, this.next = e.states;
	}
}, qs = Us();
function Js(e) {
	return globalThis.Buffer == null ? qs(e) : mi(e);
}
var Ys = class {
	len;
	head;
	tail;
	states;
	constructor() {
		this.len = 0, this.head = new Ws(Gs, 0, 0), this.tail = this.head, this.states = null;
	}
	_push(e, t, n) {
		return this.tail = this.tail.next = new Ws(e, t, n), this.len += t, this;
	}
	uint32(e) {
		return this.len += (this.tail = this.tail.next = new Qs((e >>>= 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5, e)).len, this;
	}
	int32(e) {
		return e < 0 ? this._push($s, 10, Ca.fromNumber(e)) : this.uint32(e);
	}
	sint32(e) {
		return this.uint32((e << 1 ^ e >> 31) >>> 0);
	}
	uint64(e) {
		let t = Ca.fromBigInt(e);
		return this._push($s, t.length(), t);
	}
	uint64Number(e) {
		return this._push(fa, da(e), e);
	}
	uint64String(e) {
		return this.uint64(BigInt(e));
	}
	int64(e) {
		return this.uint64(e);
	}
	int64Number(e) {
		return this.uint64Number(e);
	}
	int64String(e) {
		return this.uint64String(e);
	}
	sint64(e) {
		let t = Ca.fromBigInt(e).zzEncode();
		return this._push($s, t.length(), t);
	}
	sint64Number(e) {
		let t = Ca.fromNumber(e).zzEncode();
		return this._push($s, t.length(), t);
	}
	sint64String(e) {
		return this.sint64(BigInt(e));
	}
	bool(e) {
		return this._push(Xs, 1, +!!e);
	}
	fixed32(e) {
		return this._push(ec, 4, e >>> 0);
	}
	sfixed32(e) {
		return this.fixed32(e);
	}
	fixed64(e) {
		let t = Ca.fromBigInt(e);
		return this._push(ec, 4, t.lo)._push(ec, 4, t.hi);
	}
	fixed64Number(e) {
		let t = Ca.fromNumber(e);
		return this._push(ec, 4, t.lo)._push(ec, 4, t.hi);
	}
	fixed64String(e) {
		return this.fixed64(BigInt(e));
	}
	sfixed64(e) {
		return this.fixed64(e);
	}
	sfixed64Number(e) {
		return this.fixed64Number(e);
	}
	sfixed64String(e) {
		return this.fixed64String(e);
	}
	float(e) {
		return this._push(ga, 4, e);
	}
	double(e) {
		return this._push(ya, 8, e);
	}
	bytes(e) {
		let t = e.length >>> 0;
		return t === 0 ? this._push(Xs, 1, 0) : this.uint32(t)._push(tc, t, e);
	}
	string(e) {
		let t = Ea(e);
		return t === 0 ? this._push(Xs, 1, 0) : this.uint32(t)._push(Oa, t, e);
	}
	fork() {
		return this.states = new Ks(this), this.head = this.tail = new Ws(Gs, 0, 0), this.len = 0, this;
	}
	reset() {
		return this.states == null ? (this.head = this.tail = new Ws(Gs, 0, 0), this.len = 0) : (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next), this;
	}
	ldelim() {
		let e = this.head, t = this.tail, n = this.len;
		return this.reset().uint32(n), n !== 0 && (this.tail.next = e.next, this.tail = t, this.len += n), this;
	}
	finish() {
		let e = this.head.next, t = Js(this.len), n = 0;
		for (; e != null;) e.fn(e.val, t, n), n += e.len, e = e.next;
		return t;
	}
};
function Xs(e, t, n) {
	t[n] = e & 255;
}
function Zs(e, t, n) {
	for (; e > 127;) t[n++] = e & 127 | 128, e >>>= 7;
	t[n] = e;
}
var Qs = class extends Ws {
	next;
	constructor(e, t) {
		super(Zs, e, t), this.next = void 0;
	}
};
function $s(e, t, n) {
	for (; e.hi !== 0;) t[n++] = e.lo & 127 | 128, e.lo = (e.lo >>> 7 | e.hi << 25) >>> 0, e.hi >>>= 7;
	for (; e.lo > 127;) t[n++] = e.lo & 127 | 128, e.lo >>>= 7;
	t[n++] = e.lo;
}
function ec(e, t, n) {
	t[n] = e & 255, t[n + 1] = e >>> 8 & 255, t[n + 2] = e >>> 16 & 255, t[n + 3] = e >>> 24;
}
function tc(e, t, n) {
	t.set(e, n);
}
globalThis.Buffer != null && (Ys.prototype.bytes = function(e) {
	let t = e.length >>> 0;
	return this.uint32(t), t > 0 && this._push(nc, t, e), this;
}, Ys.prototype.string = function(e) {
	let t = globalThis.Buffer.byteLength(e);
	return this.uint32(t), t > 0 && this._push(rc, t, e), this;
});
function nc(e, t, n) {
	t.set(e, n);
}
function rc(e, t, n) {
	e.length < 40 ? Oa(e, t, n) : t.utf8Write == null ? t.set(Hs(e), n) : t.utf8Write(e, n);
}
function ic() {
	return new Ys();
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/encode.js
function ac(e, t) {
	let n = ic();
	return t.encode(e, n, { lengthDelimited: !1 }), n.finish();
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/stream.js
function* oc(e, t, n) {
	let r = Ma(e);
	yield* t.stream(r, void 0, "$", n);
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/codec.js
var sc = {
	VARINT: 0,
	BIT64: 1,
	LENGTH_DELIMITED: 2,
	START_GROUP: 3,
	END_GROUP: 4,
	BIT32: 5
};
function cc(e, t, n, r, i) {
	return {
		name: e,
		type: t,
		encode: n,
		decode: r,
		stream: i
	};
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/codecs/enum.js
function lc(e) {
	function t(t) {
		if (e[t.toString()] == null) throw Error("Invalid enum value");
		return e[t];
	}
	return cc("enum", sc.VARINT, function(e, n) {
		let r = t(e);
		n.int32(r);
	}, function(e) {
		return t(e.int32());
	}, function* (e) {
		yield t(e.int32());
	});
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/codecs/message.js
function uc(e, t, n) {
	return cc("message", sc.LENGTH_DELIMITED, e, t, n);
}
// node_modules/.pnpm/protons-runtime@6.0.2/node_modules/protons-runtime/dist/src/index.js
var dc = class extends Error {
	code = "ERR_MAX_LENGTH";
	name = "MaxLengthError";
}, fc;
(function(e) {
	(function(e) {
		e.Raw = "Raw", e.Directory = "Directory", e.File = "File", e.Metadata = "Metadata", e.Symlink = "Symlink", e.HAMTShard = "HAMTShard";
	})(e.DataType ||= {});
	let t;
	(function(e) {
		e[e.Raw = 0] = "Raw", e[e.Directory = 1] = "Directory", e[e.File = 2] = "File", e[e.Metadata = 3] = "Metadata", e[e.Symlink = 4] = "Symlink", e[e.HAMTShard = 5] = "HAMTShard";
	})(t ||= {}), (function(e) {
		e.codec = () => lc(t);
	})(e.DataType ||= {});
	let n;
	e.codec = () => (n ??= uc((t, n, r = {}) => {
		if (r.lengthDelimited !== !1 && n.fork(), t.Type != null && (n.uint32(8), e.DataType.codec().encode(t.Type, n)), t.Data != null && (n.uint32(18), n.bytes(t.Data)), t.filesize != null && (n.uint32(24), n.uint64(t.filesize)), t.blocksizes != null && t.blocksizes.length > 0) for (let e of t.blocksizes) n.uint32(32), n.uint64(e);
		t.hashType != null && (n.uint32(40), n.uint64(t.hashType)), t.fanout != null && (n.uint32(48), n.uint64(t.fanout)), t.mode != null && (n.uint32(56), n.uint32(t.mode)), t.mtime != null && (n.uint32(66), pc.codec().encode(t.mtime, n)), r.lengthDelimited !== !1 && n.ldelim();
	}, (t, n, r = {}) => {
		let i = { blocksizes: [] }, a = n == null ? t.len : t.pos + n;
		for (; t.pos < a;) {
			let n = t.uint32();
			switch (n >>> 3) {
				case 1:
					i.Type = e.DataType.codec().decode(t);
					break;
				case 2:
					i.Data = t.bytes();
					break;
				case 3:
					i.filesize = t.uint64();
					break;
				case 4:
					if (r.limits?.blocksizes != null && i.blocksizes.length === r.limits.blocksizes) throw new dc("Decode error - repeated field \"blocksizes\" had too many elements");
					i.blocksizes.push(t.uint64());
					break;
				case 5:
					i.hashType = t.uint64();
					break;
				case 6:
					i.fanout = t.uint64();
					break;
				case 7:
					i.mode = t.uint32();
					break;
				case 8:
					i.mtime = pc.codec().decode(t, t.uint32(), { limits: r.limits?.mtime });
					break;
				default: t.skipType(n & 7);
			}
		}
		return i;
	}, function* (t, n, r, i = {}) {
		let a = { blocksizes: 0 }, o = n == null ? t.len : t.pos + n;
		for (; t.pos < o;) {
			let n = t.uint32();
			switch (n >>> 3) {
				case 1:
					yield {
						field: `${r}.Type`,
						value: e.DataType.codec().decode(t)
					};
					break;
				case 2:
					yield {
						field: `${r}.Data`,
						value: t.bytes()
					};
					break;
				case 3:
					yield {
						field: `${r}.filesize`,
						value: t.uint64()
					};
					break;
				case 4:
					if (i.limits?.blocksizes != null && a.blocksizes === i.limits.blocksizes) throw new dc("Streaming decode error - repeated field \"blocksizes\" had too many elements");
					yield {
						field: `${r}.blocksizes[]`,
						index: a.blocksizes,
						value: t.uint64()
					}, a.blocksizes++;
					break;
				case 5:
					yield {
						field: `${r}.hashType`,
						value: t.uint64()
					};
					break;
				case 6:
					yield {
						field: `${r}.fanout`,
						value: t.uint64()
					};
					break;
				case 7:
					yield {
						field: `${r}.mode`,
						value: t.uint32()
					};
					break;
				case 8:
					yield* pc.codec().stream(t, t.uint32(), `${r}.mtime`, { limits: i.limits?.mtime });
					break;
				default: t.skipType(n & 7);
			}
		}
	}), n);
	function r(t) {
		return ac(t, e.codec());
	}
	e.encode = r;
	function i(t, n) {
		return Na(t, e.codec(), n);
	}
	e.decode = i;
	function a(t, n) {
		return oc(t, e.codec(), n);
	}
	e.stream = a;
})(fc ||= {});
var pc;
(function(e) {
	let t;
	e.codec = () => (t ??= uc((e, t, n = {}) => {
		n.lengthDelimited !== !1 && t.fork(), e.Seconds != null && (t.uint32(8), t.int64(e.Seconds)), e.FractionalNanoseconds != null && (t.uint32(21), t.fixed32(e.FractionalNanoseconds)), n.lengthDelimited !== !1 && t.ldelim();
	}, (e, t, n = {}) => {
		let r = {}, i = t == null ? e.len : e.pos + t;
		for (; e.pos < i;) {
			let t = e.uint32();
			switch (t >>> 3) {
				case 1:
					r.Seconds = e.int64();
					break;
				case 2:
					r.FractionalNanoseconds = e.fixed32();
					break;
				default: e.skipType(t & 7);
			}
		}
		return r;
	}, function* (e, t, n, r = {}) {
		let i = t == null ? e.len : e.pos + t;
		for (; e.pos < i;) {
			let t = e.uint32();
			switch (t >>> 3) {
				case 1:
					yield {
						field: `${n}.Seconds`,
						value: e.int64()
					};
					break;
				case 2:
					yield {
						field: `${n}.FractionalNanoseconds`,
						value: e.fixed32()
					};
					break;
				default: e.skipType(t & 7);
			}
		}
	}), t);
	function n(t) {
		return ac(t, e.codec());
	}
	e.encode = n;
	function r(t, n) {
		return Na(t, e.codec(), n);
	}
	e.decode = r;
	function i(t, n) {
		return oc(t, e.codec(), n);
	}
	e.stream = i;
})(pc ||= {});
var mc;
(function(e) {
	let t;
	e.codec = () => (t ??= uc((e, t, n = {}) => {
		n.lengthDelimited !== !1 && t.fork(), e.MimeType != null && (t.uint32(10), t.string(e.MimeType)), n.lengthDelimited !== !1 && t.ldelim();
	}, (e, t, n = {}) => {
		let r = {}, i = t == null ? e.len : e.pos + t;
		for (; e.pos < i;) {
			let t = e.uint32();
			switch (t >>> 3) {
				case 1:
					r.MimeType = e.string();
					break;
				default: e.skipType(t & 7);
			}
		}
		return r;
	}, function* (e, t, n, r = {}) {
		let i = t == null ? e.len : e.pos + t;
		for (; e.pos < i;) {
			let t = e.uint32();
			switch (t >>> 3) {
				case 1:
					yield {
						field: `${n}.MimeType`,
						value: e.string()
					};
					break;
				default: e.skipType(t & 7);
			}
		}
	}), t);
	function n(t) {
		return ac(t, e.codec());
	}
	e.encode = n;
	function r(t, n) {
		return Na(t, e.codec(), n);
	}
	e.decode = r;
	function i(t, n) {
		return oc(t, e.codec(), n);
	}
	e.stream = i;
})(mc ||= {});
// node_modules/.pnpm/ipfs-unixfs@12.0.2/node_modules/ipfs-unixfs/dist/src/index.js
var hc = {
	Raw: "raw",
	Directory: "directory",
	File: "file",
	Metadata: "metadata",
	Symlink: "symlink",
	HAMTShard: "hamt-sharded-directory"
}, gc = ["directory", "hamt-sharded-directory"], _c = 420, vc = 493, P = class e {
	static unmarshal(t) {
		let n = fc.decode(t), r = new e({
			type: hc[n.Type == null ? "File" : n.Type.toString()],
			data: n.Data,
			blockSizes: n.blocksizes,
			mode: n.mode,
			mtime: n.mtime == null ? void 0 : {
				secs: n.mtime.Seconds ?? 0n,
				nsecs: n.mtime.FractionalNanoseconds
			},
			fanout: n.fanout
		});
		return r._originalMode = n.mode ?? 0, r;
	}
	type;
	data;
	blockSizes;
	hashType;
	fanout;
	mtime;
	_mode;
	_originalMode;
	constructor(e = { type: "file" }) {
		let { type: t, data: n, blockSizes: r, hashType: i, fanout: a, mtime: o, mode: s } = e;
		if (t != null && !Object.values(hc).includes(t)) throw new na("Type: " + t + " is not valid");
		this.type = t ?? "file", this.data = n, this.hashType = i, this.fanout = a, this.blockSizes = r ?? [], this._originalMode = 0, this.mode = s, this.mtime = o;
	}
	set mode(e) {
		this._mode = e == null ? this.isDirectory() ? vc : _c : e & 4095;
	}
	get mode() {
		return this._mode;
	}
	isDirectory() {
		return gc.includes(this.type);
	}
	addBlockSize(e) {
		this.blockSizes.push(e);
	}
	removeBlockSize(e) {
		this.blockSizes.splice(e, 1);
	}
	fileSize() {
		if (this.isDirectory()) return 0n;
		let e = 0n;
		return this.blockSizes.forEach((t) => {
			e += t;
		}), this.data != null && (e += BigInt(this.data.length)), e;
	}
	marshal() {
		let e;
		switch (this.type) {
			case "raw":
				e = fc.DataType.Raw;
				break;
			case "directory":
				e = fc.DataType.Directory;
				break;
			case "file":
				e = fc.DataType.File;
				break;
			case "metadata":
				e = fc.DataType.Metadata;
				break;
			case "symlink":
				e = fc.DataType.Symlink;
				break;
			case "hamt-sharded-directory":
				e = fc.DataType.HAMTShard;
				break;
			default: throw new na(`Type: ${e} is not valid`);
		}
		let t = this.data;
		(this.data == null || this.data.length === 0) && (t = void 0);
		let n;
		this.mode != null && (n = this._originalMode & 4294963200 | (this.mode ?? 0), n === _c && !this.isDirectory() && (n = void 0), n === vc && this.isDirectory() && (n = void 0));
		let r;
		return this.mtime != null && (r = {
			Seconds: this.mtime.secs,
			FractionalNanoseconds: this.mtime.nsecs
		}), fc.encode({
			Type: e,
			Data: t,
			filesize: this.isDirectory() ? void 0 : this.fileSize(),
			blocksizes: this.blockSizes,
			hashType: this.hashType,
			fanout: this.fanout,
			mode: n,
			mtime: r
		});
	}
}, yc = class extends Event {
	type;
	detail;
	constructor(e, t) {
		super(e), this.type = e, this.detail = t;
	}
}, bc = async (e, t, n) => {
	n.codec ??= ea;
	let r = await Ts.digest(e), i = N.create(n.cidVersion ?? 1, n.codec.code, r);
	return await t.put(i, e, n), i;
};
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dag-builder/buffer-importer.js
function xc(e) {
	return async function* (t, n) {
		let r = 0n;
		for await (let i of t.content) yield async () => {
			let a, o = {
				codec: ea,
				cidVersion: e.cidVersion,
				onProgress: e.onProgress
			};
			e.rawLeaves ? (o.codec = Ro, o.cidVersion = 1) : (a = new P({
				type: e.leafType,
				data: i
			}), i = O({
				Data: a.marshal(),
				Links: []
			}));
			let s = await bc(i, n, o);
			return r += BigInt(i.byteLength), e.onProgress?.(new yc("unixfs:importer:progress:file:write", {
				bytesWritten: r,
				cid: s,
				path: t.path
			})), {
				cid: s,
				unixfs: a,
				size: BigInt(i.length),
				block: i
			};
		};
	};
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/errors.js
var Sc = class e extends Error {
	static name = "InvalidParametersError";
	static code = "ERR_INVALID_PARAMS";
	name = e.name;
	code = e.code;
	constructor(e = "Invalid parameters") {
		super(e);
	}
}, Cc = class e extends Error {
	static name = "InvalidContentError";
	static code = "ERR_INVALID_CONTENT";
	name = e.name;
	code = e.code;
	constructor(e = "Invalid content") {
		super(e);
	}
}, wc = class extends Error {
	static name = "InvalidShardingStrategyError";
	static code = "ERR_SHARDING_STRATEGY";
	name = Cc.name;
	code = Cc.code;
}, Tc = async (e, t, n) => {
	let r = new P({
		type: "directory",
		mtime: e.mtime,
		mode: e.mode
	}), i = O(D({ Data: r.marshal() }));
	return {
		cid: await bc(i, t, n),
		path: e.path,
		unixfs: r,
		size: BigInt(i.length),
		originalPath: e.originalPath,
		block: i
	};
};
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dag-builder/file.js
async function* Ec(e, t, n) {
	let r = -1, i;
	for await (let a of fi(n.bufferImporter(e, t), n.blockWriteConcurrency)) r++, r === 0 ? i = {
		...a,
		single: !0
	} : (r === 1 && i != null && (yield {
		...i,
		block: void 0,
		single: void 0
	}, i = void 0), yield {
		...a,
		block: void 0
	});
	i != null && (yield i);
}
function Dc(e) {
	return e.single === !0;
}
var Oc = (e, t, n) => async function(r) {
	if (r.length === 1 && Dc(r[0]) && n.reduceSingleLeafToSelf) {
		let i = r[0], a = i.block;
		return Dc(i) && (e.mtime !== void 0 || e.mode !== void 0) && (i.unixfs = new P({
			type: "file",
			mtime: e.mtime,
			mode: e.mode,
			data: i.block
		}), a = {
			Data: i.unixfs.marshal(),
			Links: []
		}, i.block = O(D(a)), i.cid = await bc(i.block, t, {
			...n,
			cidVersion: n.cidVersion
		}), i.size = BigInt(i.block.length)), n.onProgress?.(new yc("unixfs:importer:progress:file:layout", {
			cid: i.cid,
			path: e.originalPath
		})), {
			cid: i.cid,
			path: e.path,
			unixfs: i.unixfs,
			size: i.size,
			originalPath: e.originalPath
		};
	}
	let i = new P({
		type: "file",
		mtime: e.mtime,
		mode: e.mode
	}), a = r.filter((e) => e.cid.code === 85 && e.size > 0 || e.unixfs != null && e.unixfs.data == null && e.unixfs.fileSize() > 0n || !!e.unixfs?.data?.length).map((e) => e.cid.code === 85 ? (i.addBlockSize(e.size), {
		Name: "",
		Tsize: Number(e.size),
		Hash: e.cid
	}) : (e.unixfs?.data == null ? i.addBlockSize(e.unixfs?.fileSize() ?? 0n) : i.addBlockSize(BigInt(e.unixfs.data.length)), {
		Name: "",
		Tsize: Number(e.size),
		Hash: e.cid
	})), o = {
		Data: i.marshal(),
		Links: a
	}, s = O(D(o)), c = await bc(s, t, n);
	return n.onProgress?.(new yc("unixfs:importer:progress:file:layout", {
		cid: c,
		path: e.originalPath
	})), {
		cid: c,
		path: e.path,
		unixfs: i,
		size: BigInt(s.length + o.Links.reduce((e, t) => e + (t.Tsize ?? 0), 0)),
		originalPath: e.originalPath,
		block: s
	};
}, kc = async (e, t, n) => n.layout(Ec(e, t, n), Oc(e, t, n));
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dag-builder/index.js
function Ac(e) {
	return Symbol.iterator in e;
}
function jc(e) {
	return Symbol.asyncIterator in e;
}
function Mc(e) {
	try {
		if (e instanceof Uint8Array) return (async function* () {
			yield e;
		})();
		if (Ac(e)) return (async function* () {
			yield* e;
		})();
		if (jc(e)) return e;
	} catch {
		throw new Cc("Content was invalid");
	}
	throw new Cc("Content was invalid");
}
function Nc(e) {
	return async function* (t, n) {
		for await (let r of t) {
			let t;
			if (r.path != null && (t = r.path, r.path = r.path.split("/").filter((e) => e != null && e !== ".").join("/")), Pc(r)) {
				let i = {
					path: r.path,
					mtime: r.mtime,
					mode: r.mode,
					content: (async function* () {
						let t = 0n;
						for await (let n of e.chunker(e.chunkValidator(Mc(r.content)))) {
							let i = BigInt(n.byteLength);
							t += i, e.onProgress?.(new yc("unixfs:importer:progress:file:read", {
								bytesRead: t,
								chunkSize: i,
								path: r.path
							})), yield n;
						}
					})(),
					originalPath: t
				}, a = e.fileBuilder ?? kc;
				yield async () => a(i, n, e);
			} else if (r.path != null) {
				let i = {
					path: r.path,
					mtime: r.mtime,
					mode: r.mode,
					originalPath: t
				}, a = e.dirBuilder ?? Tc;
				yield async () => a(i, n, e);
			} else throw Error("Import candidate must have content or path or both");
		}
	};
}
function Pc(e) {
	return e.content != null;
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dag-builder/validate-chunks.js
var Fc = () => async function* (e) {
	for await (let t of e) {
		if (t.length === void 0) throw new Cc("Content was invalid");
		if (typeof t == "string" || t instanceof String) yield Hs(t.toString());
		else if (Array.isArray(t)) yield Uint8Array.from(t);
		else if (t instanceof Uint8Array) yield t;
		else throw new Cc("Content was invalid");
	}
}, Ic = 174;
function Lc(e) {
	let t = e?.maxChildrenPerNode ?? Ic;
	return async function e(n, r) {
		let i = [];
		for await (let e of di(n, t)) i.push(await r(e));
		return i.length > 1 ? e(i, r) : i[0];
	};
}
// node_modules/.pnpm/it-all@3.0.11/node_modules/it-all/dist/src/index.js
function Rc(e) {
	return e[Symbol.asyncIterator] != null;
}
function zc(e) {
	if (Rc(e)) return (async () => {
		let t = [];
		for await (let n of e) t.push(n);
		return t;
	})();
	let t = [];
	for (let n of e) t.push(n);
	return t;
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dir.js
var Bc = class {
	options;
	root;
	dir;
	path;
	dirty;
	flat;
	parent;
	parentKey;
	unixfs;
	mode;
	mtime;
	cid;
	size;
	nodeSize;
	constructor(e, t) {
		this.options = t ?? {}, this.root = e.root, this.dir = e.dir, this.path = e.path, this.dirty = e.dirty, this.flat = e.flat, this.parent = e.parent, this.parentKey = e.parentKey, this.unixfs = e.unixfs, this.mode = e.mode, this.mtime = e.mtime;
	}
}, Vc = 2 ** 32, Hc = [
	0,
	1,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	5,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	6,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	7,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8,
	8
];
function Uc(e) {
	let t = 0;
	return e >= Vc && (e = Math.floor(e / Vc), t = 32), e >= 65536 && (e >>>= 16, t += 16), e >= 256 && (e >>>= 8, t += 8), t + Hc[e];
}
function Wc(e) {
	return e % 2 == 0 && e++, Math.floor((Uc(e) + 6) / 7);
}
function Gc(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		r < 128 ? t++ : r < 2048 ? t += 2 : r >= 55296 && r <= 56319 && n + 1 < e.length ? (n++, t += 4) : t += 3;
	}
	return t;
}
function Kc(e, t, n) {
	let r = 1 + Wc(t) + t;
	return r += 1 + Wc(e) + e, r += 1 + Wc(n), 1 + Wc(r) + r;
}
var qc = 493;
function Jc(e, t) {
	let n = 2;
	if (e !== void 0 && e !== qc && (n += 1 + Wc(e)), t != null) {
		let e = 0, r = Number(t.secs);
		e += r < 0 ? 11 : 1 + Wc(r), t.nsecs != null && (e += 5), n += 1 + Wc(e) + e;
	}
	return 1 + Wc(n) + n;
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dir-flat.js
function Yc(e, t) {
	return t?.cid != null && t?.size != null ? e + t.cid.byteLength : 0;
}
function Xc(e, t) {
	return t?.cid != null && t?.size != null ? Kc(e, t.cid.byteLength, Number(t.size)) : 0;
}
var Zc = class extends Bc {
	_children;
	constructor(e, t) {
		super(e, t), this._children = /* @__PURE__ */ new Map();
	}
	async put(e, t) {
		if (this.nodeSize !== void 0) {
			let n = this._children.get(e), r = Gc(e), i = this.options?.shardSplitStrategy;
			if (i === "links-bytes") this.nodeSize -= Yc(r, n), this.nodeSize += Yc(r, t);
			else if (i === "block-bytes") this.nodeSize -= Xc(r, n), this.nodeSize += Xc(r, t);
			else throw new wc(`Invalid shardSplitStrategy: ${i}`);
			this.nodeSize < 0 && (this.nodeSize = void 0);
		}
		this.cid = void 0, this.size = void 0, this._children.set(e, t);
	}
	async get(e) {
		return Promise.resolve(this._children.get(e));
	}
	childCount() {
		return this._children.size;
	}
	directChildrenCount() {
		return this.childCount();
	}
	onlyChild() {
		return this._children.values().next().value;
	}
	*eachChildSeries() {
		for (let [e, t] of this._children.entries()) yield {
			key: e,
			child: t
		};
	}
	marshal() {
		let e = new P({
			type: "directory",
			mtime: this.mtime,
			mode: this.mode
		}), t = [];
		for (let [e, n] of this._children.entries()) if (n.size != null && n.cid != null) {
			if (n.cid == null) throw Error("Directory contents must be flushed before marshaling");
			t.push({
				Hash: n.cid,
				Name: e,
				Tsize: n.size == null ? void 0 : Number(n.size)
			});
		}
		return O(D({
			Data: e.marshal(),
			Links: t
		}));
	}
	async estimateNodeSize() {
		if (this.nodeSize !== void 0) return this.nodeSize;
		let e = this.options?.shardSplitStrategy;
		if (e === "links-bytes") {
			this.nodeSize = 0;
			for (let [e, t] of this._children.entries()) this.nodeSize += Yc(Gc(e), t);
		} else if (e === "block-bytes") {
			this.nodeSize = Jc(this.mode, this.mtime);
			for (let [e, t] of this._children.entries()) this.nodeSize += Xc(Gc(e), t);
		} else throw new wc(`Invalid shardSplitStrategy: ${e}`);
		return this.nodeSize;
	}
	async *flush(e) {
		let t = [];
		for (let [n, r] of this._children.entries()) {
			let i = r;
			if (r instanceof Bc) for await (let t of r.flush(e)) i = t, yield t;
			i.size != null && i.cid != null && t.push({
				Name: n,
				Tsize: Number(i.size),
				Hash: i.cid
			});
		}
		let n = new P({
			type: "directory",
			mtime: this.mtime,
			mode: this.mode
		}), r = {
			Data: n.marshal(),
			Links: t
		}, i = O(D(r)), a = await bc(i, e, this.options), o = i.length + r.Links.reduce((e, t) => e + (t.Tsize ?? 0), 0);
		this.cid = a, this.size = o, yield {
			cid: a,
			unixfs: n,
			path: this.path,
			size: BigInt(o)
		};
	}
}, Qc = 20;
function $c({ name: e, code: t, encode: n, minDigestLength: r, maxDigestLength: i }) {
	return new el(e, t, n, r, i);
}
var el = class {
	name;
	code;
	encode;
	minDigestLength;
	maxDigestLength;
	constructor(e, t, n, r, i) {
		this.name = e, this.code = t, this.encode = n, this.minDigestLength = r ?? Qc, this.maxDigestLength = i;
	}
	digest(e, t) {
		if (t?.truncate != null) {
			if (t.truncate < this.minDigestLength) throw Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
			if (this.maxDigestLength != null && t.truncate > this.maxDigestLength) throw Error(`Invalid truncate option, must be less than or equal to ${this.maxDigestLength}`);
		}
		if (e instanceof Uint8Array) {
			let n = this.encode(e);
			return n instanceof Uint8Array ? tl(n, this.code, t?.truncate) : n.then((e) => tl(e, this.code, t?.truncate));
		}
		throw Error("Unknown type, must be binary type");
	}
};
function tl(e, t, n) {
	if (n != null && n !== e.byteLength) {
		if (n > e.byteLength) throw Error(`Invalid truncate option, must be less than or equal to ${e.byteLength}`);
		e = e.subarray(0, n);
	}
	return pr(t, e);
}
// node_modules/.pnpm/@multiformats+murmur3@2.2.8/node_modules/@multiformats/murmur3/src/vendor/murmur.js
function nl(e, t) {
	let n = e.lo + t.lo >>> 0;
	return {
		lo: n,
		hi: e.hi + t.hi + +(n < e.lo) >>> 0
	};
}
function rl(e, t) {
	return e + t >>> 0;
}
function F(e, t) {
	let n = e.lo & 65535, r = e.lo >>> 16, i = t.lo & 65535, a = t.lo >>> 16, o = n * i, s = n * a, c = r * i, l = r * a, u = (o >>> 16) + (s & 65535) + (c & 65535) >>> 0, d = (u << 16 | o & 65535) >>> 0, f = l + (s >>> 16) + (c >>> 16) + (u >>> 16), p = Math.imul(e.lo, t.hi), m = Math.imul(e.hi, t.lo);
	return {
		lo: d,
		hi: f + p + m >>> 0
	};
}
function il(e, t) {
	return Math.imul(e, t) >>> 0;
}
function al(e, t) {
	return t === 0 ? e : t === 32 ? {
		lo: e.hi,
		hi: e.lo
	} : t < 32 ? {
		lo: (e.lo << t | e.hi >>> 32 - t) >>> 0,
		hi: (e.hi << t | e.lo >>> 32 - t) >>> 0
	} : (t -= 32, {
		lo: (e.hi << t | e.lo >>> 32 - t) >>> 0,
		hi: (e.lo << t | e.hi >>> 32 - t) >>> 0
	});
}
function I(e, t) {
	return {
		lo: (e.lo ^ t.lo) >>> 0,
		hi: (e.hi ^ t.hi) >>> 0
	};
}
function ol(e, t) {
	return t === 0 ? e : t < 32 ? {
		lo: (e.lo >>> t | e.hi << 32 - t) >>> 0,
		hi: e.hi >>> t
	} : {
		lo: e.hi >>> t - 32,
		hi: 0
	};
}
function L(e, t) {
	return {
		lo: e >>> 0,
		hi: t >>> 0
	};
}
function sl(e, t) {
	return (e << t | e >>> 32 - t) >>> 0;
}
function cl(e, t) {
	let n = t * 8, r = e[n] | e[n + 1] << 8 | e[n + 2] << 16 | e[n + 3] << 24, i = e[n + 4] | e[n + 5] << 8 | e[n + 6] << 16 | e[n + 7] << 24;
	return {
		lo: r >>> 0,
		hi: i >>> 0
	};
}
function ll(e, t) {
	let n = t * 4;
	return (e[n] | e[n + 1] << 8 | e[n + 2] << 16 | e[n + 3] << 24) >>> 0;
}
function ul(e) {
	return e = I(e, ol(e, 33)), e = F(e, L(3981806797, 4283543511)), e = I(e, ol(e, 33)), e = F(e, L(444984403, 3301882366)), e = I(e, ol(e, 33)), e;
}
function dl(e) {
	return e ^= e >>> 16, e = il(e, 2246822507), e ^= e >>> 13, e = il(e, 3266489909), e ^= e >>> 16, e;
}
function fl(e, t = 0) {
	let n = L(t, 0), r = L(t, 0), i = e.length, a = Math.floor(i / 16), o = L(289559509, 2277735313), s = L(658871167, 1291169091);
	for (let t = 0; t < a; t++) {
		let i = cl(e, t * 2), a = cl(e, t * 2 + 1);
		i = F(i, o), i = al(i, 31), i = F(i, s), n = I(n, i), n = al(n, 27), n = nl(n, r), n = nl(F(n, L(5, 0)), L(1390208809, 0)), a = F(a, s), a = al(a, 33), a = F(a, o), r = I(r, a), r = al(r, 31), r = nl(r, n), r = nl(F(r, L(5, 0)), L(944331445, 0));
	}
	let c = L(0, 0), l = L(0, 0), u = e.slice(a * 16);
	switch (u.length) {
		case 15: l = I(l, L(0, u[14] << 16));
		case 14: l = I(l, L(0, u[13] << 8));
		case 13: l = I(l, L(0, u[12]));
		case 12: l = I(l, L(u[11] << 24, 0));
		case 11: l = I(l, L(u[10] << 16, 0));
		case 10: l = I(l, L(u[9] << 8, 0));
		case 9: l = I(l, L(u[8], 0)), l = F(l, s), l = al(l, 33), l = F(l, o), r = I(r, l);
		case 8: c = I(c, L(0, u[7] << 24));
		case 7: c = I(c, L(0, u[6] << 16));
		case 6: c = I(c, L(0, u[5] << 8));
		case 5: c = I(c, L(0, u[4]));
		case 4: c = I(c, L(u[3] << 24, 0));
		case 3: c = I(c, L(u[2] << 16, 0));
		case 2: c = I(c, L(u[1] << 8, 0));
		case 1: c = I(c, L(u[0], 0)), c = F(c, o), c = al(c, 31), c = F(c, s), n = I(n, c);
	}
	let d = L(i, 0);
	return n = I(n, d), r = I(r, d), n = nl(n, r), r = nl(r, n), n = ul(n), r = ul(r), n = nl(n, r), r = nl(r, n), new Uint8Array([
		n.hi >>> 24 & 255,
		n.hi >>> 16 & 255,
		n.hi >>> 8 & 255,
		n.hi & 255,
		n.lo >>> 24 & 255,
		n.lo >>> 16 & 255,
		n.lo >>> 8 & 255,
		n.lo & 255,
		r.hi >>> 24 & 255,
		r.hi >>> 16 & 255,
		r.hi >>> 8 & 255,
		r.hi & 255,
		r.lo >>> 24 & 255,
		r.lo >>> 16 & 255,
		r.lo >>> 8 & 255,
		r.lo & 255
	]);
}
function pl(e, t = 0) {
	let n = t >>> 0, r = e.length, i = Math.floor(r / 4), a = 3432918353, o = 461845907;
	for (let t = 0; t < i; t++) {
		let r = ll(e, t);
		r = il(r, a), r = sl(r, 15), r = il(r, o), n ^= r, n = sl(n, 13), n = rl(il(n, 5), 3864292196);
	}
	let s = e.slice(i * 4), c = 0;
	switch (s.length) {
		case 3: c ^= s[2] << 16;
		case 2: c ^= s[1] << 8;
		case 1: c ^= s[0], c = il(c, a), c = sl(c, 15), c = il(c, o), n ^= c;
	}
	return n ^= r, n = dl(n), n;
}
// node_modules/.pnpm/@multiformats+murmur3@2.2.8/node_modules/@multiformats/murmur3/src/index.js
function ml(e) {
	let t = [
		,
		,
		,
		,
	];
	for (let n = 0; n < 4; n++) t[n] = e & 255, e >>= 8;
	return new Uint8Array(t);
}
$c({
	name: "murmur3-32",
	code: 35,
	encode: (e) => ml(pl(e))
});
var hl = $c({
	name: "murmur3-128",
	code: 34,
	encode: (e) => fl(e)
});
$c({
	name: "murmur3-x64-64",
	code: 34,
	encode: (e) => fl(e).subarray(0, 8)
});
// node_modules/.pnpm/interface-store@7.0.2/node_modules/interface-store/dist/src/errors.js
var gl = class e extends Error {
	static name = "NotFoundError";
	name = e.name;
	static code = "ERR_NOT_FOUND";
	code = e.code;
	constructor(e = "Not Found") {
		super(e);
	}
}, _l = class {
	has(e, t) {
		return Promise.reject(/* @__PURE__ */ Error(".has is not implemented"));
	}
	put(e, t, n) {
		return Promise.reject(/* @__PURE__ */ Error(".put is not implemented"));
	}
	async *putMany(e, t) {
		for await (let { cid: n, bytes: r } of e) await this.put(n, r, t), yield n;
	}
	get(e, t) {
		throw Error(".get is not implemented");
	}
	async *getMany(e, t) {
		for await (let n of e) yield {
			cid: n,
			bytes: this.get(n, t)
		};
	}
	delete(e, t) {
		return Promise.reject(/* @__PURE__ */ Error(".delete is not implemented"));
	}
	async *deleteMany(e, t) {
		for await (let n of e) await this.delete(n, t), yield n;
	}
	async *getAll(e) {
		throw Error(".getAll is not implemented");
	}
}, vl = class extends _l {
	put(e, t, n) {
		return n?.signal?.throwIfAborted(), e;
	}
	get(e, t) {
		throw t?.signal?.throwIfAborted(), new gl();
	}
	has(e, t) {
		return t?.signal?.throwIfAborted(), !1;
	}
	async delete(e, t) {
		t?.signal?.throwIfAborted();
	}
	async *getAll(e) {
		e?.signal?.throwIfAborted();
	}
}, yl = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	t.exports = class {
		constructor() {
			this._bitArrays = [], this._data = [], this._length = 0, this._changedLength = !1, this._changedData = !1;
		}
		set(e, t) {
			let n = this._internalPositionFor(e, !1);
			if (t === void 0) n !== -1 && (this._unsetInternalPos(n), this._unsetBit(e), this._changedLength = !0, this._changedData = !0);
			else {
				let r = !1;
				n === -1 ? (n = this._data.length, this._setBit(e), this._changedData = !0) : r = !0, this._setInternalPos(n, e, t, r), this._changedLength = !0;
			}
		}
		unset(e) {
			this.set(e, void 0);
		}
		get(e) {
			this._sortData();
			let t = this._internalPositionFor(e, !0);
			if (t !== -1) return this._data[t][1];
		}
		push(e) {
			return this.set(this.length, e), this.length;
		}
		get length() {
			if (this._sortData(), this._changedLength) {
				let e = this._data[this._data.length - 1];
				this._length = e ? e[0] + 1 : 0, this._changedLength = !1;
			}
			return this._length;
		}
		forEach(e) {
			let t = 0;
			for (; t < this.length;) e(this.get(t), t, this), t++;
		}
		map(e) {
			let t = 0, n = Array(this.length);
			for (; t < this.length;) n[t] = e(this.get(t), t, this), t++;
			return n;
		}
		reduce(e, t) {
			let n = 0, r = t;
			for (; n < this.length;) {
				let t = this.get(n);
				r = e(r, t, n), n++;
			}
			return r;
		}
		find(e) {
			let t = 0, n, r;
			for (; t < this.length && !n;) r = this.get(t), n = e(r), t++;
			return n ? r : void 0;
		}
		_internalPositionFor(e, t) {
			let i = this._bytePosFor(e, t);
			if (i >= this._bitArrays.length) return -1;
			let a = this._bitArrays[i], o = e - i * 7;
			return (a & 1 << o) > 0 ? this._bitArrays.slice(0, i).reduce(n, 0) + r(a & ~(4294967295 << o + 1)) - 1 : -1;
		}
		_bytePosFor(e, t) {
			let n = Math.floor(e / 7), r = n + 1;
			for (; !t && this._bitArrays.length < r;) this._bitArrays.push(0);
			return n;
		}
		_setBit(e) {
			let t = this._bytePosFor(e, !1);
			this._bitArrays[t] |= 1 << e - t * 7;
		}
		_unsetBit(e) {
			let t = this._bytePosFor(e, !1);
			this._bitArrays[t] &= ~(1 << e - t * 7);
		}
		_setInternalPos(e, t, n, r) {
			let i = this._data, a = [t, n];
			if (r) this._sortData(), i[e] = a;
			else {
				if (i.length) {
					if (i[i.length - 1][0] >= t) i.push(a);
					else if (i[0][0] <= t) i.unshift(a);
					else {
						let e = Math.round(i.length / 2);
						this._data = i.slice(0, e).concat(a).concat(i.slice(e));
					}
				} else this._data.push(a);
				this._changedData = !0, this._changedLength = !0;
			}
		}
		_unsetInternalPos(e) {
			this._data.splice(e, 1);
		}
		_sortData() {
			this._changedData && this._data.sort(i), this._changedData = !1;
		}
		bitField() {
			let e = [], t = 8, n = 0, r = 0, i, a = this._bitArrays.slice();
			for (; a.length || n;) {
				n === 0 && (i = a.shift(), n = 7);
				let o = Math.min(n, t), s = ~(255 << o), c = i & s;
				r |= c << 8 - t, i >>>= o, n -= o, t -= o, t && (n || a.length) || (e.push(r), r = 0, t = 8);
			}
			for (var o = e.length - 1; o > 0 && e[o] === 0; o--) e.pop();
			return e;
		}
		compactArray() {
			return this._sortData(), this._data.map(a);
		}
	};
	function n(e, t) {
		return e + r(t);
	}
	function r(e) {
		let t = e;
		return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), (t + (t >> 4) & 252645135) * 16843009 >> 24;
	}
	function i(e, t) {
		return e[0] - t[0];
	}
	function a(e) {
		return e[1];
	}
})))(), 1), bl = /* @__PURE__ */ c({ base10: () => xl }), xl = Tn({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
}), Sl = /* @__PURE__ */ c({
	base16: () => Cl,
	base16upper: () => wl
}), Cl = E({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4,
	caseInsensitive: !0
}), wl = E({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4,
	caseInsensitive: !0
}), Tl = /* @__PURE__ */ c({ base2: () => El }), El = E({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
}), Dl = /* @__PURE__ */ c({ base256emoji: () => Nl }), Ol = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), kl = Ol.reduce((e, t, n) => (e[n] = t, e), []), Al = Ol.reduce((e, t, n) => {
	let r = t.codePointAt(0);
	if (r == null) throw Error(`Invalid character: ${t}`);
	return e[r] = n, e;
}, []);
function jl(e) {
	return e.reduce((e, t) => (e += kl[t], e), "");
}
function Ml(e) {
	let t = [];
	for (let n of e) {
		let e = n.codePointAt(0);
		if (e == null) throw Error(`Invalid character: ${n}`);
		let r = Al[e];
		if (r == null) throw Error(`Non-base256emoji character: ${n}`);
		t.push(r);
	}
	return new Uint8Array(t);
}
var Nl = wn({
	prefix: "🚀",
	name: "base256emoji",
	encode: jl,
	decode: Ml
}), Pl = /* @__PURE__ */ c({
	base64: () => Fl,
	base64pad: () => Il,
	base64url: () => Ll,
	base64urlpad: () => Rl
}), Fl = E({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
}), Il = E({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
}), Ll = E({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
}), Rl = E({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
}), zl = /* @__PURE__ */ c({ base8: () => Bl }), Bl = E({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
}), Vl = /* @__PURE__ */ c({ identity: () => Hl }), Hl = wn({
	prefix: "\0",
	name: "identity",
	encode: (e) => mn(dn(e)),
	decode: (e) => dn(fn(e))
});
new TextEncoder(), new TextDecoder();
// node_modules/.pnpm/multiformats@14.0.5/node_modules/multiformats/dist/src/hashes/identity.js
var Ul = /* @__PURE__ */ c({ identity: () => Jl }), Wl = 0, Gl = "identity", Kl = dn;
function ql(e, t) {
	if (t?.truncate != null && t.truncate !== e.byteLength) {
		if (t.truncate < 0 || t.truncate > e.byteLength) throw Error(`Invalid truncate option, must be less than or equal to ${e.byteLength}`);
		e = e.subarray(0, t.truncate);
	}
	return pr(Wl, Kl(e));
}
var Jl = {
	code: Wl,
	name: Gl,
	encode: Kl,
	digest: ql
}, Yl = /* @__PURE__ */ c({
	sha256: () => Zl,
	sha512: () => Ql
});
function Xl(e) {
	return async (t) => new Uint8Array(await crypto.subtle.digest(e, t));
}
var Zl = $c({
	name: "sha2-256",
	code: 18,
	encode: Xl("SHA-256")
}), Ql = $c({
	name: "sha2-512",
	code: 19,
	encode: Xl("SHA-512")
}), $l = {
	...Vl,
	...Tl,
	...zl,
	...bl,
	...Sl,
	...kn,
	...zn,
	...Hn,
	...Pl,
	...Dl
};
({
	...Yl,
	...Ul
});
// node_modules/.pnpm/uint8arrays@6.1.1/node_modules/uint8arrays/dist/src/alloc.js
function eu(e = 0) {
	return new Uint8Array(e);
}
function tu(e = 0) {
	return new Uint8Array(e);
}
// node_modules/.pnpm/uint8arrays@6.1.1/node_modules/uint8arrays/dist/src/util/bases.js
function nu(e, t, n, r) {
	return {
		name: e,
		prefix: t,
		encoder: {
			name: e,
			prefix: t,
			encode: n
		},
		decoder: { decode: r }
	};
}
var ru = nu("utf8", "u", (e) => "u" + new TextDecoder("utf8").decode(e), (e) => new TextEncoder().encode(e.substring(1))), iu = nu("ascii", "a", (e) => {
	let t = "a";
	for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
	return t;
}, (e) => {
	e = e.substring(1);
	let t = tu(e.length);
	for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
	return t;
}), au = {
	utf8: ru,
	"utf-8": ru,
	hex: $l.base16,
	latin1: iu,
	ascii: iu,
	binary: iu,
	...$l
};
// node_modules/.pnpm/uint8arrays@6.1.1/node_modules/uint8arrays/dist/src/from-string.js
function ou(e, t = "utf8") {
	let n = au[t];
	if (n == null) throw Error(`Unsupported encoding "${t}"`);
	return n.decoder.decode(`${n.prefix}${e}`);
}
// node_modules/.pnpm/hamt-sharding@3.0.8/node_modules/hamt-sharding/dist/src/bucket.js
var su = class e {
	_options;
	_popCount;
	_parent;
	_posAtParent;
	_children;
	key;
	constructor(e, t, n = 0) {
		this._options = e, this._popCount = 0, this._parent = t, this._posAtParent = n, this._children = new yl.default(), this.key = null;
	}
	async put(e, t) {
		let n = await this._findNewBucketAndPos(e);
		n.bucket._putAt(n, e, t);
	}
	async get(e) {
		let t = await this._findChild(e);
		if (t != null) return t.value;
	}
	async del(e) {
		let t = await this._findPlace(e), n = t.bucket._at(t.pos);
		n != null && n.key === e && t.bucket._delAt(t.pos);
	}
	leafCount() {
		return this._children.compactArray().reduce((t, n) => n instanceof e ? t + n.leafCount() : t + 1, 0);
	}
	childrenCount() {
		return this._children.length;
	}
	onlyChild() {
		return this._children.get(0);
	}
	*eachLeafSeries() {
		let t = this._children.compactArray();
		for (let n of t) n instanceof e ? yield* n.eachLeafSeries() : yield n;
	}
	serialize(t, n) {
		return n(this._children.reduce((r, i, a) => (i != null && (i instanceof e ? r.push(i.serialize(t, n)) : r.push(t(i, a))), r), []));
	}
	async asyncTransform(e, t) {
		return du(this, e, t);
	}
	toJSON() {
		return this.serialize(lu, uu);
	}
	prettyPrint() {
		return JSON.stringify(this.toJSON(), null, "  ");
	}
	tableSize() {
		return 2 ** this._options.bits;
	}
	async _findChild(t) {
		let n = await this._findPlace(t), r = n.bucket._at(n.pos);
		if (!(r instanceof e) && r != null && r.key === t) return r;
	}
	async _findPlace(t) {
		let n = this._options.hash(typeof t == "string" ? ou(t) : t), r = await n.take(this._options.bits), i = this._children.get(r);
		return i instanceof e ? i._findPlace(n) : {
			bucket: this,
			pos: r,
			hash: n,
			existingChild: i
		};
	}
	async _findNewBucketAndPos(t) {
		let n = await this._findPlace(t);
		if (n.existingChild != null && n.existingChild.key !== t) {
			let t = new e(this._options, n.bucket, n.pos);
			n.bucket._putObjectAt(n.pos, t);
			let r = await t._findPlace(n.existingChild.hash);
			return r.bucket._putAt(r, n.existingChild.key, n.existingChild.value), t._findNewBucketAndPos(n.hash);
		}
		return n;
	}
	_putAt(e, t, n) {
		this._putObjectAt(e.pos, {
			key: t,
			value: n,
			hash: e.hash
		});
	}
	_putObjectAt(e, t) {
		this._children.get(e) ?? this._popCount++, this._children.set(e, t);
	}
	_delAt(e) {
		if (e === -1) throw Error("Invalid position");
		this._children.get(e) != null && this._popCount--, this._children.unset(e), this._level();
	}
	_level() {
		if (this._parent != null && this._popCount <= 1) {
			if (this._popCount === 1) {
				let t = this._children.find(cu);
				if (t != null && !(t instanceof e)) {
					let e = t.hash;
					e.untake(this._options.bits);
					let n = {
						pos: this._posAtParent,
						hash: e,
						bucket: this._parent
					};
					this._parent._putAt(n, t.key, t.value);
				}
			} else this._parent._delAt(this._posAtParent);
		}
	}
	_at(e) {
		return this._children.get(e);
	}
};
function cu(e) {
	return !!e;
}
function lu(e, t) {
	return e.key;
}
function uu(e) {
	return e;
}
async function du(e, t, n) {
	let r = [];
	for (let i of e._children.compactArray()) if (i instanceof su) await du(i, t, n);
	else {
		let n = await t(i);
		r.push({
			bitField: e._children.bitField(),
			children: n
		});
	}
	return n(r);
}
// node_modules/.pnpm/uint8arrays@6.1.1/node_modules/uint8arrays/dist/src/util/as-uint8array.js
function fu(e) {
	return e?.buffer instanceof ArrayBuffer;
}
function pu(e) {
	if (fu(e)) return e;
	let t = e.slice();
	return new Uint8Array(t.buffer, 0, t.byteLength);
}
// node_modules/.pnpm/uint8arrays@6.1.1/node_modules/uint8arrays/dist/src/concat.js
function mu(e, t) {
	t ??= e.reduce((e, t) => e + t.length, 0);
	let n = tu(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return pu(n);
}
// node_modules/.pnpm/hamt-sharding@3.0.8/node_modules/hamt-sharding/dist/src/consumable-buffer.js
var hu = [
	255,
	254,
	252,
	248,
	240,
	224,
	192,
	128
], gu = [
	1,
	3,
	7,
	15,
	31,
	63,
	127,
	255
], _u = class {
	_value;
	_currentBytePos;
	_currentBitPos;
	constructor(e) {
		this._value = e, this._currentBytePos = e.length - 1, this._currentBitPos = 7;
	}
	availableBits() {
		return this._currentBitPos + 1 + this._currentBytePos * 8;
	}
	totalBits() {
		return this._value.length * 8;
	}
	take(e) {
		let t = e, n = 0;
		for (; t > 0 && this._haveBits();) {
			let e = this._value[this._currentBytePos], r = this._currentBitPos + 1, i = Math.min(r, t), a = vu(e, r - i, i);
			n = (n << i) + a, t -= i, this._currentBitPos -= i, this._currentBitPos < 0 && (this._currentBitPos = 7, this._currentBytePos--);
		}
		return n;
	}
	untake(e) {
		for (this._currentBitPos += e; this._currentBitPos > 7;) this._currentBitPos -= 8, this._currentBytePos += 1;
	}
	_haveBits() {
		return this._currentBytePos >= 0;
	}
};
function vu(e, t, n) {
	return (e & yu(t, n)) >>> t;
}
function yu(e, t) {
	return hu[e] & gu[Math.min(t + e - 1, 7)];
}
// node_modules/.pnpm/hamt-sharding@3.0.8/node_modules/hamt-sharding/dist/src/consumable-hash.js
function bu(e) {
	function t(t) {
		return t instanceof xu ? t : new xu(t, e);
	}
	return t;
}
var xu = class {
	_value;
	_hashFn;
	_depth;
	_availableBits;
	_currentBufferIndex;
	_buffers;
	constructor(e, t) {
		if (!(e instanceof Uint8Array)) throw Error("can only hash Uint8Arrays");
		this._value = e, this._hashFn = t, this._depth = -1, this._availableBits = 0, this._currentBufferIndex = 0, this._buffers = [];
	}
	async take(e) {
		let t = e;
		for (; this._availableBits < t;) await this._produceMoreBits();
		let n = 0;
		for (; t > 0;) {
			let e = this._buffers[this._currentBufferIndex], r = Math.min(e.availableBits(), t), i = e.take(r);
			n = (n << r) + i, t -= r, this._availableBits -= r, e.availableBits() === 0 && this._currentBufferIndex++;
		}
		return n;
	}
	untake(e) {
		let t = e;
		for (; t > 0;) {
			let e = this._buffers[this._currentBufferIndex], n = Math.min(e.totalBits() - e.availableBits(), t);
			e.untake(n), t -= n, this._availableBits += n, this._currentBufferIndex > 0 && e.totalBits() === e.availableBits() && (this._depth--, this._currentBufferIndex--);
		}
	}
	async _produceMoreBits() {
		this._depth++;
		let e = this._depth > 0 ? mu([this._value, Uint8Array.from([this._depth])]) : this._value, t = new _u(await this._hashFn(e));
		this._buffers.push(t), this._availableBits += t.availableBits();
	}
};
// node_modules/.pnpm/hamt-sharding@3.0.8/node_modules/hamt-sharding/dist/src/index.js
function Su(e) {
	if (e == null || e.hashFn == null) throw Error("please define an options.hashFn");
	return new su({
		bits: e.bits ?? 8,
		hash: bu(e.hashFn)
	});
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/dir-sharded.js
async function Cu(e) {
	return (await hl.encode(e)).slice(0, 8).reverse();
}
var wu = class extends Bc {
	bucket;
	constructor(e, t) {
		super(e, t), this.bucket = Su({
			hashFn: Cu,
			bits: t.shardFanoutBits ?? 8
		});
	}
	async put(e, t) {
		this.cid = void 0, this.size = void 0, this.nodeSize = void 0, await this.bucket.put(e, t);
	}
	async get(e) {
		return this.bucket.get(e);
	}
	childCount() {
		return this.bucket.leafCount();
	}
	directChildrenCount() {
		return this.bucket.childrenCount();
	}
	onlyChild() {
		return this.bucket.onlyChild();
	}
	*eachChildSeries() {
		for (let { key: e, value: t } of this.bucket.eachLeafSeries()) yield {
			key: e,
			child: t
		};
	}
	async estimateNodeSize() {
		if (this.nodeSize !== void 0) return this.nodeSize;
		let e = new vl(), t = await Du(this.bucket, this, e, this.options);
		return this.nodeSize = t.size, this.nodeSize;
	}
	async *flush(e) {
		for await (let t of Tu(this.bucket, e, this, this.options)) yield {
			...t,
			path: this.path
		};
	}
};
async function* Tu(e, t, n, r) {
	let i = e._children, a = (e.tableSize() - 1).toString(16).length, o = [], s = 0n;
	for (let e = 0; e < i.length; e++) {
		let n = i.get(e);
		if (n == null) continue;
		let c = e.toString(16).toUpperCase().padStart(a, "0");
		if (n instanceof su) {
			let e;
			for await (let i of Tu(n, t, null, r)) e = i;
			if (e == null) throw Error("Could not flush sharded directory, no sub-shard found");
			o.push({
				Name: c,
				Tsize: Number(e.size),
				Hash: e.cid
			}), s += e.size;
		} else if (Eu(n.value)) {
			let e = n.value, r;
			for await (let n of e.flush(t)) r = n, yield r;
			if (r == null) throw Error("Did not flush dir");
			let i = c + n.key;
			o.push({
				Name: i,
				Tsize: Number(r.size),
				Hash: r.cid
			}), s += r.size;
		} else {
			let e = n.value;
			if (e.cid == null) continue;
			let t = c + n.key, r = e.size;
			o.push({
				Name: t,
				Tsize: Number(r),
				Hash: e.cid
			}), s += BigInt(r ?? 0);
		}
	}
	let c = new P({
		type: "hamt-sharded-directory",
		data: Uint8Array.from(i.bitField().reverse()),
		fanout: BigInt(e.tableSize()),
		hashType: Si,
		mtime: n?.mtime,
		mode: n?.mode
	}), l = O(D({
		Data: c.marshal(),
		Links: o
	}));
	yield {
		cid: await bc(l, t, r),
		unixfs: c,
		size: BigInt(l.byteLength) + s
	};
}
function Eu(e) {
	return typeof e.flush == "function";
}
async function Du(e, t, n, r) {
	let i = e._children, a = (e.tableSize() - 1).toString(16).length, o = [], s = 0;
	for (let e = 0; e < i.length; e++) {
		let t = i.get(e);
		if (t == null) continue;
		let c = e.toString(16).toUpperCase().padStart(a, "0");
		if (t instanceof su) {
			let { size: e, cid: i } = await Du(t, null, n, r);
			o.push({
				Name: c,
				Tsize: Number(e),
				Hash: i
			}), s += c.length + i.byteLength;
		} else if (Eu(t.value)) {
			let e = t.value, n = e.nodeSize;
			if (e.cid == null) throw Error("Child directory has not been persisted");
			o.push({
				Name: c + t.key,
				Tsize: Number(n),
				Hash: e.cid
			}), s += c.length + e.cid.byteLength;
		} else {
			let e = t.value, n = c + t.key, r = e.size;
			o.push({
				Name: n,
				Tsize: Number(r),
				Hash: e.cid
			}), s += c.length + e.cid.byteLength;
		}
	}
	let c = O(D({
		Data: new P({
			type: "hamt-sharded-directory",
			data: Uint8Array.from(i.bitField().reverse()),
			fanout: BigInt(e.tableSize()),
			hashType: Si,
			mtime: t?.mtime,
			mode: t?.mode
		}).marshal(),
		Links: o
	}));
	return {
		cid: await bc(c, n, r),
		size: r.shardSplitStrategy === "links-bytes" ? s : c.length
	};
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/flat-to-shard.js
async function Ou(e, t) {
	let n = t, r = t.options.shardSplitThresholdBytes ?? 262144;
	t instanceof Zc && await t.estimateNodeSize() > r && (n = await ku(t));
	let i = n.parent;
	if (i != null) {
		if (n !== t) {
			if (e != null && (e.parent = n), n.parentKey == null) throw Error("No parent key found");
			await i.put(n.parentKey, n);
		}
		return Ou(n, i);
	}
	return n;
}
async function ku(e) {
	let t = new wu({
		root: e.root,
		dir: !0,
		parent: e.parent,
		parentKey: e.parentKey,
		path: e.path,
		dirty: e.dirty,
		flat: !1,
		mtime: e.mtime,
		mode: e.mode
	}, e.options);
	for (let { key: n, child: r } of e.eachChildSeries()) await t.put(n, r);
	return t;
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/utils/to-path-components.js
var Au = (e = "") => e.split(/(?<!\\)\//).filter(Boolean);
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/tree-builder.js
async function ju(e, t, n) {
	let r = Au(e.path ?? ""), i = r.length - 1, a = t, o = "";
	for (let s = 0; s < r.length; s++) {
		let c = r[s];
		o += `${o === "" ? "" : "/"}${c}`;
		let l = s === i;
		if (a.dirty = !0, a.cid = void 0, a.size = void 0, l) await a.put(c, e), t = await Ou(null, a);
		else {
			let e = await a.get(c);
			e != null && e instanceof Bc || (e = new Zc({
				root: !1,
				dir: !0,
				parent: a,
				parentKey: c,
				path: o,
				dirty: !0,
				flat: !0,
				mtime: e?.unixfs?.mtime,
				mode: e?.unixfs?.mode
			}, n)), await a.put(c, e), a = e;
		}
	}
	return t;
}
async function* Mu(e, t) {
	e instanceof Bc ? yield* e.flush(t) : e.unixfs?.isDirectory() === !0 && (yield e);
}
function Nu(e) {
	return async function* (t, n) {
		let r = new Zc({
			root: !0,
			dir: !0,
			path: "",
			dirty: !0,
			flat: !0
		}, e), i, a = !1;
		for await (let n of t) {
			if (n == null) continue;
			let t = `${n.originalPath ?? ""}`.split("/")[0];
			t != null && t !== "" && (i == null ? (i = t, a = !0) : i !== t && (a = !1)), r = await ju(n, r, e), n.unixfs?.isDirectory() !== !0 && (yield n);
		}
		if (e.wrapWithDirectory || a && r.childCount() > 1) yield* Mu(r, n);
		else for (let e of r.eachChildSeries()) e != null && (yield* Mu(e.child, n));
	};
}
// node_modules/.pnpm/ipfs-unixfs-importer@16.1.5/node_modules/ipfs-unixfs-importer/dist/src/index.js
async function* Pu(e, t, n = {}) {
	let r;
	r = Symbol.asyncIterator in e || Symbol.iterator in e ? e : [e];
	let i, a;
	n.profile === "unixfs-v0-2015" ? (n.shardSplitStrategy = n.shardSplitStrategy ?? "links-bytes", n.cidVersion = n.cidVersion ?? 0, n.rawLeaves = n.rawLeaves ?? !1, i = Ci, a = 174) : n.profile === "unixfs-v1-2025" && (n.shardSplitStrategy = n.shardSplitStrategy ?? "block-bytes", n.cidVersion = n.cidVersion ?? 1, n.rawLeaves = n.rawLeaves ?? !0, i = wi, a = 1024);
	let o = n.wrapWithDirectory ?? !1, s = n.shardSplitThresholdBytes ?? 262144, c = n.shardSplitStrategy ?? "links-bytes", l = n.shardFanoutBits ?? 8, u = n.cidVersion ?? 1, d = n.rawLeaves ?? !0, f = n.leafType ?? "file", p = n.fileImportConcurrency ?? 50, m = n.blockWriteConcurrency ?? 10, h = n.reduceSingleLeafToSelf ?? !0, g = n.chunker ?? Ti({ chunkSize: i }), ee = n.chunkValidator ?? Fc(), te = n.dagBuilder ?? Nc({
		chunker: g,
		chunkValidator: ee,
		wrapWithDirectory: o,
		layout: n.layout ?? Lc({ maxChildrenPerNode: a }),
		bufferImporter: n.bufferImporter ?? xc({
			cidVersion: u,
			rawLeaves: d,
			leafType: f,
			onProgress: n.onProgress
		}),
		blockWriteConcurrency: m,
		reduceSingleLeafToSelf: h,
		cidVersion: u,
		onProgress: n.onProgress,
		dirBuilder: n.dirBuilder,
		fileBuilder: n.fileBuilder
	}), ne = n.treeBuilder ?? Nu({
		wrapWithDirectory: o,
		shardSplitThresholdBytes: s,
		shardSplitStrategy: c,
		shardFanoutBits: l,
		cidVersion: u,
		onProgress: n.onProgress
	});
	for await (let e of ne(fi(te(r, t), p), t)) yield {
		cid: e.cid,
		path: e.path,
		unixfs: e.unixfs,
		size: e.size
	};
}
async function Fu(e, t, n = {}) {
	let r = await li(Pu([e], t, n));
	if (r == null) throw new Sc("Nothing imported");
	return r;
}
// node_modules/.pnpm/it-last@3.0.11/node_modules/it-last/dist/src/index.js
function Iu(e) {
	return e[Symbol.asyncIterator] != null;
}
function Lu(e) {
	if (Iu(e)) return (async () => {
		let t;
		for await (let n of e) t = n;
		return t;
	})();
	let t;
	for (let n of e) t = n;
	return t;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/errors.js
var Ru = class extends Error {
	name;
	code;
	constructor(e, t, n) {
		super(e), this.name = t, this.code = n;
	}
}, zu = class extends Ru {
	constructor(e = "not a Unixfs node") {
		super(e, "NotUnixFSError", "ERR_NOT_UNIXFS");
	}
}, Bu = class extends Ru {
	constructor(e = "invalid PBNode") {
		super(e, "InvalidPBNodeError", "ERR_INVALID_PB_NODE");
	}
}, Vu = class extends Ru {
	constructor(e = "unknown error") {
		super(e, "InvalidPBNodeError", "ERR_UNKNOWN_ERROR");
	}
}, Hu = class extends Ru {
	constructor(e = "path already exists") {
		super(e, "AlreadyExistsError", "ERR_ALREADY_EXISTS");
	}
}, Uu = class extends Ru {
	constructor(e = "path does not exist") {
		super(e, "DoesNotExistError", "ERR_DOES_NOT_EXIST");
	}
}, Wu = class extends Ru {
	constructor(e = "no content") {
		super(e, "NoContentError", "ERR_NO_CONTENT");
	}
}, Gu = class extends Ru {
	constructor(e = "not a file") {
		super(e, "NotAFileError", "ERR_NOT_A_FILE");
	}
}, Ku = class extends Ru {
	constructor(e = "not a directory") {
		super(e, "NotADirectoryError", "ERR_NOT_A_DIRECTORY");
	}
}, qu = class extends Ru {
	constructor(e = "invalid parameters") {
		super(e, "InvalidParametersError", "ERR_INVALID_PARAMETERS");
	}
}, Ju = {
	cidVersion: 1,
	rawLeaves: !0,
	layout: Lc({ maxChildrenPerNode: 1024 }),
	chunker: Ti({ chunkSize: 1048576 })
};
async function* Yu(e, t, n = {}) {
	yield* Pu(e, t, {
		...Ju,
		...n
	});
}
async function Xu(e, t, n = {}) {
	let { cid: r } = await Fu({
		content: e,
		mode: n.mode,
		mtime: n.mtime
	}, t, {
		...Ju,
		...n
	});
	return r;
}
async function Zu(e, t, n = {}) {
	let { cid: r } = await Fu({
		content: e,
		mode: n.mode,
		mtime: n.mtime
	}, t, {
		...Ju,
		...n
	});
	return r;
}
async function Qu(e, t, n = {}) {
	if (e.path == null) throw new qu("path is required");
	if (e.content == null) throw new qu("content is required");
	let r = await Lu(Yu([e], t, {
		...Ju,
		...n,
		wrapWithDirectory: !0
	}));
	if (r == null) throw new qu("Nothing imported");
	return r.cid;
}
async function $u(e, t, n = {}) {
	if (e.content != null) throw new qu("Directories cannot have content, use addFile instead");
	let r = await (e.path == null ? li : Lu)(Yu([{
		...e,
		path: e.path ?? "-"
	}], t, {
		...Ju,
		...n,
		wrapWithDirectory: e.path != null
	}));
	if (r == null) throw new qu("Nothing imported");
	return r.cid;
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/errors.js
var ed = class e extends Error {
	static name = "BadPathError";
	static code = "ERR_BAD_PATH";
	name = e.name;
	code = e.code;
	constructor(e = "Bad path") {
		super(e);
	}
}, td = class e extends Error {
	static name = "NotFoundError";
	static code = "ERR_NOT_FOUND";
	name = e.name;
	code = e.code;
	constructor(e = "Not found") {
		super(e);
	}
}, nd = class e extends Error {
	static name = "NoResolverError";
	static code = "ERR_NO_RESOLVER";
	name = e.name;
	code = e.code;
	constructor(e = "No resolver") {
		super(e);
	}
}, R = class e extends Error {
	static name = "NotUnixFSError";
	static code = "ERR_NOT_UNIXFS";
	name = e.name;
	code = e.code;
	constructor(e = "Not UnixFS") {
		super(e);
	}
}, rd = class e extends Error {
	static name = "OverReadError";
	static code = "ERR_OVER_READ";
	name = e.name;
	code = e.code;
	constructor(e = "Over read") {
		super(e);
	}
}, id = class e extends Error {
	static name = "UnderReadError";
	static code = "ERR_UNDER_READ";
	name = e.name;
	code = e.code;
	constructor(e = "Under read") {
		super(e);
	}
}, ad = class e extends Error {
	static name = "InvalidParametersError";
	static code = "ERR_INVALID_PARAMS";
	name = e.name;
	code = e.code;
	constructor(e = "Invalid parameters") {
		super(e);
	}
}, od = [
	"Object",
	"RegExp",
	"Date",
	"Error",
	"Map",
	"Set",
	"WeakMap",
	"WeakSet",
	"ArrayBuffer",
	"SharedArrayBuffer",
	"DataView",
	"Promise",
	"URL",
	"HTMLElement",
	"Int8Array",
	"Uint8ClampedArray",
	"Int16Array",
	"Uint16Array",
	"Int32Array",
	"Uint32Array",
	"Float32Array",
	"Float64Array",
	"BigInt64Array",
	"BigUint64Array",
	"Tagged"
];
function sd(e) {
	if (e === null) return "null";
	if (e === void 0) return "undefined";
	if (e === !0 || e === !1) return "boolean";
	let t = typeof e;
	return t === "string" || t === "number" || t === "bigint" || t === "symbol" ? t : t === "function" ? "Function" : Array.isArray(e) ? "Array" : e instanceof Uint8Array ? "Uint8Array" : e.constructor === Object ? "Object" : cd(e) || "Object";
}
function cd(e) {
	let t = Object.prototype.toString.call(e).slice(8, -1);
	if (od.includes(t)) return t;
}
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/token.js
var z = class {
	constructor(e, t, n) {
		this.major = e, this.majorEncoded = e << 5, this.name = t, this.terminal = n;
	}
	toString() {
		return `Type[${this.major}].${this.name}`;
	}
	compare(e) {
		return this.major < e.major ? -1 : +(this.major > e.major);
	}
	static equals(e, t) {
		return e === t || e.major === t.major && e.name === t.name;
	}
};
z.uint = new z(0, "uint", !0), z.negint = new z(1, "negint", !0), z.bytes = new z(2, "bytes", !0), z.string = new z(3, "string", !0), z.array = new z(4, "array", !1), z.map = new z(5, "map", !1), z.tag = new z(6, "tag", !1), z.float = new z(7, "float", !0), z.false = new z(7, "false", !0), z.true = new z(7, "true", !0), z.null = new z(7, "null", !0), z.undefined = new z(7, "undefined", !0), z.break = new z(7, "break", !0);
var B = class {
	constructor(e, t, n) {
		this.type = e, this.value = t, this.encodedLength = n, this.encodedBytes = void 0, this.byteValue = void 0;
	}
	toString() {
		return `Token[${this.type}].${this.value}`;
	}
}, ld = globalThis.process && !globalThis.process.browser && globalThis.Buffer && typeof globalThis.Buffer.isBuffer == "function", ud = new TextEncoder();
function dd(e) {
	return ld && globalThis.Buffer.isBuffer(e);
}
function fd(e) {
	return e instanceof Uint8Array ? dd(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : e : Uint8Array.from(e);
}
var pd = 24, md = 200, hd = ld ? (e) => e.length >= pd ? globalThis.Buffer.from(e) : xd(e) : (e) => e.length >= md ? ud.encode(e) : xd(e), gd = (e) => Uint8Array.from(e), _d = ld ? (e, t, n) => dd(e) ? new Uint8Array(e.subarray(t, n)) : e.slice(t, n) : (e, t, n) => e.slice(t, n), vd = ld ? (e, t) => (e = e.map((e) => e instanceof Uint8Array ? e : globalThis.Buffer.from(e)), fd(globalThis.Buffer.concat(e, t))) : (e, t) => {
	let n = new Uint8Array(t), r = 0;
	for (let t of e) r + t.length > n.length && (t = t.subarray(0, n.length - r)), n.set(t, r), r += t.length;
	return n;
}, yd = ld ? (e) => globalThis.Buffer.allocUnsafe(e) : (e) => new Uint8Array(e);
function bd(e, t) {
	if (dd(e) && dd(t)) return e.compare(t);
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return e[n] < t[n] ? -1 : 1;
	return 0;
}
function xd(e) {
	let t = [], n = 0;
	for (let r = 0; r < e.length; r++) {
		let i = e.charCodeAt(r);
		i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = i & 63 | 128) : (i & 64512) == 55296 && r + 1 < e.length && (e.charCodeAt(r + 1) & 64512) == 56320 ? (i = 65536 + ((i & 1023) << 10) + (e.charCodeAt(++r) & 1023), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128) : (i >= 55296 && i <= 57343 && (i = 65533), t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = i & 63 | 128);
	}
	return t;
}
var Sd = 4096;
function Cd(e) {
	let t = e.length;
	if (t <= Sd) return String.fromCharCode.apply(String, e);
	let n = "", r = 0;
	for (; r < t;) n += String.fromCharCode.apply(String, e.slice(r, r += Sd));
	return n;
}
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/bl.js
var wd = 256, Td = class {
	constructor(e = wd) {
		this.chunkSize = e, this.cursor = 0, this.maxCursor = -1, this.chunks = [], this._initReuseChunk = null;
	}
	reset() {
		this.cursor = 0, this.maxCursor = -1, this.chunks.length && (this.chunks = []), this._initReuseChunk !== null && (this.chunks.push(this._initReuseChunk), this.maxCursor = this._initReuseChunk.length - 1);
	}
	push(e) {
		let t = this.chunks[this.chunks.length - 1];
		if (this.cursor + e.length <= this.maxCursor + 1) {
			let n = t.length - (this.maxCursor - this.cursor) - 1;
			t.set(e, n);
		} else {
			if (t) {
				let e = t.length - (this.maxCursor - this.cursor) - 1;
				e < t.length && (this.chunks[this.chunks.length - 1] = t.subarray(0, e), this.maxCursor = this.cursor - 1);
			}
			e.length < 64 && e.length < this.chunkSize ? (t = yd(this.chunkSize), this.chunks.push(t), this.maxCursor += t.length, this._initReuseChunk === null && (this._initReuseChunk = t), t.set(e, 0)) : (this.chunks.push(e), this.maxCursor += e.length);
		}
		this.cursor += e.length;
	}
	toBytes(e = !1) {
		let t;
		if (this.chunks.length === 1) {
			let n = this.chunks[0];
			e && this.cursor > n.length / 2 ? (t = this.cursor === n.length ? n : n.subarray(0, this.cursor), this._initReuseChunk = null, this.chunks = []) : t = _d(n, 0, this.cursor);
		} else t = vd(this.chunks, this.cursor);
		return e && this.reset(), t;
	}
}, Ed = class {
	constructor(e) {
		this.dest = e, this.cursor = 0, this.chunks = [e];
	}
	reset() {
		this.cursor = 0;
	}
	push(e) {
		if (this.cursor + e.length > this.dest.length) throw Error("write out of bounds, destination buffer is too small");
		this.dest.set(e, this.cursor), this.cursor += e.length;
	}
	toBytes(e = !1) {
		let t = this.dest.subarray(0, this.cursor);
		return e && this.reset(), t;
	}
}, V = "CBOR decode error:", Dd = "CBOR encode error:";
function Od(e, t, n) {
	if (e.length - t < n) throw Error(`${V} not enough data for type`);
}
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/0uint.js
var H = [
	24,
	256,
	65536,
	4294967296,
	BigInt("18446744073709551616")
];
function kd(e, t, n) {
	Od(e, t, 1);
	let r = e[t];
	if (n.strict === !0 && r < H[0]) throw Error(`${V} integer encoded in more bytes than necessary (strict decode)`);
	return r;
}
function Ad(e, t, n) {
	Od(e, t, 2);
	let r = e[t] << 8 | e[t + 1];
	if (n.strict === !0 && r < H[1]) throw Error(`${V} integer encoded in more bytes than necessary (strict decode)`);
	return r;
}
function jd(e, t, n) {
	Od(e, t, 4);
	let r = e[t] * 16777216 + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3];
	if (n.strict === !0 && r < H[2]) throw Error(`${V} integer encoded in more bytes than necessary (strict decode)`);
	return r;
}
function Md(e, t, n) {
	Od(e, t, 8);
	let r = e[t] * 16777216 + (e[t + 1] << 16) + (e[t + 2] << 8) + e[t + 3], i = e[t + 4] * 16777216 + (e[t + 5] << 16) + (e[t + 6] << 8) + e[t + 7], a = (BigInt(r) << BigInt(32)) + BigInt(i);
	if (n.strict === !0 && a < H[3]) throw Error(`${V} integer encoded in more bytes than necessary (strict decode)`);
	if (a <= 2 ** 53 - 1) return Number(a);
	if (n.allowBigInt === !0) return a;
	throw Error(`${V} integers outside of the safe integer range are not supported`);
}
function Nd(e, t, n, r) {
	return new B(z.uint, kd(e, t + 1, r), 2);
}
function Pd(e, t, n, r) {
	return new B(z.uint, Ad(e, t + 1, r), 3);
}
function Fd(e, t, n, r) {
	return new B(z.uint, jd(e, t + 1, r), 5);
}
function Id(e, t, n, r) {
	return new B(z.uint, Md(e, t + 1, r), 9);
}
function Ld(e, t) {
	return U(e, 0, t.value);
}
function U(e, t, n) {
	if (n < H[0]) {
		let r = Number(n);
		e.push([t | r]);
	} else if (n < H[1]) {
		let r = Number(n);
		e.push([t | 24, r]);
	} else if (n < H[2]) {
		let r = Number(n);
		e.push([
			t | 25,
			r >>> 8,
			r & 255
		]);
	} else if (n < H[3]) {
		let r = Number(n);
		e.push([
			t | 26,
			r >>> 24 & 255,
			r >>> 16 & 255,
			r >>> 8 & 255,
			r & 255
		]);
	} else {
		let r = BigInt(n);
		if (r < H[4]) {
			let n = [
				t | 27,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			], i = Number(r & BigInt(4294967295)), a = Number(r >> BigInt(32) & BigInt(4294967295));
			n[8] = i & 255, i >>= 8, n[7] = i & 255, i >>= 8, n[6] = i & 255, i >>= 8, n[5] = i & 255, n[4] = a & 255, a >>= 8, n[3] = a & 255, a >>= 8, n[2] = a & 255, a >>= 8, n[1] = a & 255, e.push(n);
		} else throw Error(`${V} encountered BigInt larger than allowable range`);
	}
}
Ld.encodedSize = function(e) {
	return U.encodedSize(e.value);
}, U.encodedSize = function(e) {
	return e < H[0] ? 1 : e < H[1] ? 2 : e < H[2] ? 3 : e < H[3] ? 5 : 9;
}, Ld.compareTokens = function(e, t) {
	return e.value < t.value ? -1 : +(e.value > t.value);
};
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/1negint.js
function Rd(e, t, n, r) {
	return new B(z.negint, -1 - kd(e, t + 1, r), 2);
}
function zd(e, t, n, r) {
	return new B(z.negint, -1 - Ad(e, t + 1, r), 3);
}
function Bd(e, t, n, r) {
	return new B(z.negint, -1 - jd(e, t + 1, r), 5);
}
var Vd = BigInt(-1), Hd = BigInt(1);
function Ud(e, t, n, r) {
	let i = Md(e, t + 1, r);
	if (typeof i != "bigint") {
		let e = -1 - i;
		if (e >= -(2 ** 53 - 1)) return new B(z.negint, e, 9);
	}
	if (r.allowBigInt !== !0) throw Error(`${V} integers outside of the safe integer range are not supported`);
	return new B(z.negint, Vd - BigInt(i), 9);
}
function Wd(e, t) {
	let n = t.value, r = typeof n == "bigint" ? n * Vd - Hd : n * -1 - 1;
	U(e, t.type.majorEncoded, r);
}
Wd.encodedSize = function(e) {
	let t = e.value, n = typeof t == "bigint" ? t * Vd - Hd : t * -1 - 1;
	return n < H[0] ? 1 : n < H[1] ? 2 : n < H[2] ? 3 : n < H[3] ? 5 : 9;
}, Wd.compareTokens = function(e, t) {
	return e.value < t.value ? 1 : e.value > t.value ? -1 : 0;
};
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/2bytes.js
function Gd(e, t, n, r) {
	Od(e, t, n + r);
	let i = e.slice(t + n, t + n + r);
	return new B(z.bytes, i, n + r);
}
function Kd(e, t, n, r) {
	return Gd(e, t, 1, n);
}
function qd(e, t, n, r) {
	return Gd(e, t, 2, kd(e, t + 1, r));
}
function Jd(e, t, n, r) {
	return Gd(e, t, 3, Ad(e, t + 1, r));
}
function Yd(e, t, n, r) {
	return Gd(e, t, 5, jd(e, t + 1, r));
}
function Xd(e, t, n, r) {
	let i = Md(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${V} 64-bit integer bytes lengths not supported`);
	return Gd(e, t, 9, i);
}
function Zd(e) {
	return e.encodedBytes === void 0 && (e.encodedBytes = z.equals(e.type, z.string) ? hd(e.value) : e.value), e.encodedBytes;
}
function Qd(e, t) {
	let n = Zd(t);
	U(e, t.type.majorEncoded, n.length), e.push(n);
}
Qd.encodedSize = function(e) {
	let t = Zd(e);
	return U.encodedSize(t.length) + t.length;
}, Qd.compareTokens = function(e, t) {
	return $d(Zd(e), Zd(t));
};
function $d(e, t) {
	return e.length < t.length ? -1 : e.length > t.length ? 1 : bd(e, t);
}
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/3string.js
var ef = new TextDecoder(), tf = 32;
function nf(e, t, n) {
	if (n - t < tf) {
		let r = "";
		for (let i = t; i < n; i++) {
			let a = e[i];
			if (a & 128) return ef.decode(e.subarray(t, n));
			r += String.fromCharCode(a);
		}
		return r;
	}
	return ef.decode(e.subarray(t, n));
}
function rf(e, t, n, r, i) {
	let a = n + r;
	Od(e, t, a);
	let o = new B(z.string, nf(e, t + n, t + a), a);
	return i.retainStringBytes === !0 && (o.byteValue = e.slice(t + n, t + a)), o;
}
function af(e, t, n, r) {
	return rf(e, t, 1, n, r);
}
function of(e, t, n, r) {
	return rf(e, t, 2, kd(e, t + 1, r), r);
}
function sf(e, t, n, r) {
	return rf(e, t, 3, Ad(e, t + 1, r), r);
}
function cf(e, t, n, r) {
	return rf(e, t, 5, jd(e, t + 1, r), r);
}
function lf(e, t, n, r) {
	let i = Md(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${V} 64-bit integer string lengths not supported`);
	return rf(e, t, 9, i, r);
}
var uf = Qd;
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/4array.js
function df(e, t, n, r) {
	return new B(z.array, r, n);
}
function ff(e, t, n, r) {
	return df(e, t, 1, n);
}
function pf(e, t, n, r) {
	return df(e, t, 2, kd(e, t + 1, r));
}
function mf(e, t, n, r) {
	return df(e, t, 3, Ad(e, t + 1, r));
}
function hf(e, t, n, r) {
	return df(e, t, 5, jd(e, t + 1, r));
}
function gf(e, t, n, r) {
	let i = Md(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${V} 64-bit integer array lengths not supported`);
	return df(e, t, 9, i);
}
function _f(e, t, n, r) {
	if (r.allowIndefinite === !1) throw Error(`${V} indefinite length items not allowed`);
	return df(e, t, 1, Infinity);
}
function vf(e, t) {
	U(e, z.array.majorEncoded, t.value);
}
vf.compareTokens = Ld.compareTokens, vf.encodedSize = function(e) {
	return U.encodedSize(e.value);
};
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/5map.js
function yf(e, t, n, r) {
	return new B(z.map, r, n);
}
function bf(e, t, n, r) {
	return yf(e, t, 1, n);
}
function xf(e, t, n, r) {
	return yf(e, t, 2, kd(e, t + 1, r));
}
function Sf(e, t, n, r) {
	return yf(e, t, 3, Ad(e, t + 1, r));
}
function Cf(e, t, n, r) {
	return yf(e, t, 5, jd(e, t + 1, r));
}
function wf(e, t, n, r) {
	let i = Md(e, t + 1, r);
	if (typeof i == "bigint") throw Error(`${V} 64-bit integer map lengths not supported`);
	return yf(e, t, 9, i);
}
function Tf(e, t, n, r) {
	if (r.allowIndefinite === !1) throw Error(`${V} indefinite length items not allowed`);
	return yf(e, t, 1, Infinity);
}
function Ef(e, t) {
	U(e, z.map.majorEncoded, t.value);
}
Ef.compareTokens = Ld.compareTokens, Ef.encodedSize = function(e) {
	return U.encodedSize(e.value);
};
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/6tag.js
function Df(e, t, n, r) {
	return new B(z.tag, n, 1);
}
function Of(e, t, n, r) {
	return new B(z.tag, kd(e, t + 1, r), 2);
}
function kf(e, t, n, r) {
	return new B(z.tag, Ad(e, t + 1, r), 3);
}
function Af(e, t, n, r) {
	return new B(z.tag, jd(e, t + 1, r), 5);
}
function jf(e, t, n, r) {
	return new B(z.tag, Md(e, t + 1, r), 9);
}
function Mf(e, t) {
	U(e, z.tag.majorEncoded, t.value);
}
Mf.compareTokens = Ld.compareTokens, Mf.encodedSize = function(e) {
	return U.encodedSize(e.value);
};
function Nf(e, t, n, r) {
	if (r.allowUndefined === !1) throw Error(`${V} undefined values are not supported`);
	return r.coerceUndefinedToNull === !0 ? new B(z.null, null, 1) : new B(z.undefined, void 0, 1);
}
function Pf(e, t, n, r) {
	if (r.allowIndefinite === !1) throw Error(`${V} indefinite length items not allowed`);
	return new B(z.break, void 0, 1);
}
function Ff(e, t, n) {
	if (n) {
		if (n.allowNaN === !1 && Number.isNaN(e)) throw Error(`${V} NaN values are not supported`);
		if (n.allowInfinity === !1 && (e === Infinity || e === -Infinity)) throw Error(`${V} Infinity values are not supported`);
	}
	return new B(z.float, e, t);
}
function If(e, t, n, r) {
	return Ff(Uf(e, t + 1), 3, r);
}
function Lf(e, t, n, r) {
	return Ff(Gf(e, t + 1), 5, r);
}
function Rf(e, t, n, r) {
	return Ff(qf(e, t + 1), 9, r);
}
function zf(e, t, n) {
	let r = t.value;
	if (r === !1) e.push([z.float.majorEncoded | 20]);
	else if (r === !0) e.push([z.float.majorEncoded | 21]);
	else if (r === null) e.push([z.float.majorEncoded | 22]);
	else if (r === void 0) e.push([z.float.majorEncoded | 23]);
	else {
		let t, i = !1;
		n && n.float64 === !0 || (Hf(r), t = Uf(Vf, 1), r === t || Number.isNaN(r) ? (Vf[0] = 249, e.push(Vf.slice(0, 3)), i = !0) : (Wf(r), t = Gf(Vf, 1), r === t && (Vf[0] = 250, e.push(Vf.slice(0, 5)), i = !0))), i || (Kf(r), t = qf(Vf, 1), Vf[0] = 251, e.push(Vf.slice(0, 9)));
	}
}
zf.encodedSize = function(e, t) {
	let n = e.value;
	if (n === !1 || n === !0 || n == null) return 1;
	if (!t || t.float64 !== !0) {
		Hf(n);
		let e = Uf(Vf, 1);
		if (n === e || Number.isNaN(n)) return 3;
		if (Wf(n), e = Gf(Vf, 1), n === e) return 5;
	}
	return 9;
};
var Bf = /* @__PURE__ */ new ArrayBuffer(9), W = new DataView(Bf, 1), Vf = new Uint8Array(Bf, 0);
function Hf(e) {
	if (e === Infinity) W.setUint16(0, 31744, !1);
	else if (e === -Infinity) W.setUint16(0, 64512, !1);
	else if (Number.isNaN(e)) W.setUint16(0, 32256, !1);
	else {
		W.setFloat32(0, e);
		let t = W.getUint32(0), n = (t & 2139095040) >> 23, r = t & 8388607;
		if (n === 255) W.setUint16(0, 31744, !1);
		else if (n === 0) W.setUint16(0, (t & 2147483648) >> 16 | r >> 13, !1);
		else {
			let e = n - 127;
			e < -24 ? W.setUint16(0, 0) : e < -14 ? W.setUint16(0, (t & 2147483648) >> 16 | 1 << 24 + e, !1) : W.setUint16(0, (t & 2147483648) >> 16 | e + 15 << 10 | r >> 13, !1);
		}
	}
}
function Uf(e, t) {
	if (e.length - t < 2) throw Error(`${V} not enough data for float16`);
	let n = (e[t] << 8) + e[t + 1];
	if (n === 31744) return Infinity;
	if (n === 64512) return -Infinity;
	if (n === 32256) return NaN;
	let r = n >> 10 & 31, i = n & 1023, a;
	return a = r === 0 ? i * 2 ** -24 : r === 31 ? i === 0 ? Infinity : NaN : (i + 1024) * 2 ** (r - 25), n & 32768 ? -a : a;
}
function Wf(e) {
	W.setFloat32(0, e, !1);
}
function Gf(e, t) {
	if (e.length - t < 4) throw Error(`${V} not enough data for float32`);
	let n = (e.byteOffset || 0) + t;
	return new DataView(e.buffer, n, 4).getFloat32(0, !1);
}
function Kf(e) {
	W.setFloat64(0, e, !1);
}
function qf(e, t) {
	if (e.length - t < 8) throw Error(`${V} not enough data for float64`);
	let n = (e.byteOffset || 0) + t;
	return new DataView(e.buffer, n, 8).getFloat64(0, !1);
}
zf.compareTokens = Ld.compareTokens;
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/jump.js
function G(e, t, n) {
	throw Error(`${V} encountered invalid minor (${n}) for major ${e[t] >>> 5}`);
}
function Jf(e) {
	return () => {
		throw Error(`${V} ${e}`);
	};
}
var K = [];
for (let e = 0; e <= 23; e++) K[e] = G;
K[24] = Nd, K[25] = Pd, K[26] = Fd, K[27] = Id, K[28] = G, K[29] = G, K[30] = G, K[31] = G;
for (let e = 32; e <= 55; e++) K[e] = G;
K[56] = Rd, K[57] = zd, K[58] = Bd, K[59] = Ud, K[60] = G, K[61] = G, K[62] = G, K[63] = G;
for (let e = 64; e <= 87; e++) K[e] = Kd;
K[88] = qd, K[89] = Jd, K[90] = Yd, K[91] = Xd, K[92] = G, K[93] = G, K[94] = G, K[95] = Jf("indefinite length bytes/strings are not supported");
for (let e = 96; e <= 119; e++) K[e] = af;
K[120] = of, K[121] = sf, K[122] = cf, K[123] = lf, K[124] = G, K[125] = G, K[126] = G, K[127] = Jf("indefinite length bytes/strings are not supported");
for (let e = 128; e <= 151; e++) K[e] = ff;
K[152] = pf, K[153] = mf, K[154] = hf, K[155] = gf, K[156] = G, K[157] = G, K[158] = G, K[159] = _f;
for (let e = 160; e <= 183; e++) K[e] = bf;
K[184] = xf, K[185] = Sf, K[186] = Cf, K[187] = wf, K[188] = G, K[189] = G, K[190] = G, K[191] = Tf;
for (let e = 192; e <= 215; e++) K[e] = Df;
K[216] = Of, K[217] = kf, K[218] = Af, K[219] = jf, K[220] = G, K[221] = G, K[222] = G, K[223] = G;
for (let e = 224; e <= 243; e++) K[e] = Jf("simple values are not supported");
K[244] = G, K[245] = G, K[246] = G, K[247] = Nf, K[248] = Jf("simple values are not supported"), K[249] = If, K[250] = Lf, K[251] = Rf, K[252] = G, K[253] = G, K[254] = G, K[255] = Pf;
var Yf = [];
for (let e = 0; e < 24; e++) Yf[e] = new B(z.uint, e, 1);
for (let e = -1; e >= -24; e--) Yf[31 - e] = new B(z.negint, e, 1);
Yf[64] = new B(z.bytes, /* @__PURE__ */ new Uint8Array(), 1), Yf[96] = new B(z.string, "", 1), Yf[128] = new B(z.array, 0, 1), Yf[160] = new B(z.map, 0, 1), Yf[244] = new B(z.false, !1, 1), Yf[245] = new B(z.true, !0, 1), Yf[246] = new B(z.null, null, 1);
function Xf(e) {
	switch (e.type) {
		case z.false: return gd([244]);
		case z.true: return gd([245]);
		case z.null: return gd([246]);
		case z.bytes: return e.value.length ? void 0 : gd([64]);
		case z.string: return e.value === "" ? gd([96]) : void 0;
		case z.array: return e.value === 0 ? gd([128]) : void 0;
		case z.map: return e.value === 0 ? gd([160]) : void 0;
		case z.uint: return e.value < 24 ? gd([Number(e.value)]) : void 0;
		case z.negint: if (e.value >= -24) return gd([31 - Number(e.value)]);
	}
}
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/encode.js
var Zf = Object.freeze({
	mapSorter: op,
	quickEncodeToken: Xf
});
function Qf() {
	let e = [];
	return e[z.uint.major] = Ld, e[z.negint.major] = Wd, e[z.bytes.major] = Qd, e[z.string.major] = uf, e[z.array.major] = vf, e[z.map.major] = Ef, e[z.tag.major] = Mf, e[z.float.major] = zf, e;
}
var $f = Qf(), ep = new Td(), tp = class e {
	constructor(e, t) {
		this.obj = e, this.parent = t;
	}
	includes(e) {
		let t = this;
		do
			if (t.obj === e) return !0;
		while (t = t.parent);
		return !1;
	}
	static createCheck(t, n) {
		if (t && t.includes(n)) throw Error(`${Dd} object contains circular references`);
		return new e(n, t);
	}
}, np = {
	null: new B(z.null, null),
	undefined: new B(z.undefined, void 0),
	true: new B(z.true, !0),
	false: new B(z.false, !1),
	emptyArray: new B(z.array, 0),
	emptyMap: new B(z.map, 0)
}, rp = {
	number(e, t, n, r) {
		return !Number.isInteger(e) || !Number.isSafeInteger(e) ? new B(z.float, e) : e >= 0 ? new B(z.uint, e) : new B(z.negint, e);
	},
	bigint(e, t, n, r) {
		return e >= BigInt(0) ? new B(z.uint, e) : new B(z.negint, e);
	},
	Uint8Array(e, t, n, r) {
		return new B(z.bytes, e);
	},
	string(e, t, n, r) {
		return new B(z.string, e);
	},
	boolean(e, t, n, r) {
		return e ? np.true : np.false;
	},
	null(e, t, n, r) {
		return np.null;
	},
	undefined(e, t, n, r) {
		return np.undefined;
	},
	ArrayBuffer(e, t, n, r) {
		return new B(z.bytes, new Uint8Array(e));
	},
	DataView(e, t, n, r) {
		return new B(z.bytes, new Uint8Array(e.buffer, e.byteOffset, e.byteLength));
	},
	Array(e, t, n, r) {
		if (!e.length) return n.addBreakTokens === !0 ? [np.emptyArray, new B(z.break)] : np.emptyArray;
		r = tp.createCheck(r, e);
		let i = [], a = 0;
		for (let t of e) i[a++] = ip(t, n, r);
		return n.addBreakTokens ? [
			new B(z.array, e.length),
			i,
			new B(z.break)
		] : [new B(z.array, e.length), i];
	},
	Object(e, t, n, r) {
		let i = t !== "Object", a = i ? e.keys() : Object.keys(e), o = i ? e.size : a.length, s;
		if (o) {
			s = Array(o), r = tp.createCheck(r, e);
			let t = !i && n.ignoreUndefinedProperties, c = 0;
			for (let o of a) {
				let a = i ? e.get(o) : e[o];
				t && a === void 0 || (s[c++] = [ip(o, n, r), ip(a, n, r)]);
			}
			c < o && (s.length = c);
		}
		return s?.length ? (ap(s, n), n.addBreakTokens ? [
			new B(z.map, s.length),
			s,
			new B(z.break)
		] : [new B(z.map, s.length), s]) : n.addBreakTokens === !0 ? [np.emptyMap, new B(z.break)] : np.emptyMap;
	},
	Tagged(e, t, n, r) {
		return [new B(z.tag, e.tag), ip(e.value, n, r)];
	}
};
rp.Map = rp.Object, rp.Buffer = rp.Uint8Array;
for (let e of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) rp[`${e}Array`] = rp.DataView;
function ip(e, t = {}, n) {
	let r = sd(e), i = t && t.typeEncoders && t.typeEncoders[r] || rp[r];
	if (typeof i == "function") {
		let a = i(e, r, t, n);
		if (a != null) return a;
	}
	let a = rp[r];
	if (!a) throw Error(`${Dd} unsupported type: ${r}`);
	return a(e, r, t, n);
}
function ap(e, t) {
	t.mapSorter && e.sort(t.mapSorter);
}
function op(e, t) {
	if (e[0] instanceof B && t[0] instanceof B) {
		let n = e[0], r = t[0];
		return n._keyBytes ||= sp(n.value), r._keyBytes ||= sp(r.value), bd(n._keyBytes, r._keyBytes);
	}
	throw Error("rfc8949MapSorter: complex key types are not supported yet");
}
function sp(e) {
	return lp(e, $f, Zf);
}
function cp(e, t, n, r) {
	if (Array.isArray(t)) for (let i of t) cp(e, i, n, r);
	else n[t.type.major](e, t, r);
}
z.uint.majorEncoded, z.negint.majorEncoded, z.bytes.majorEncoded, z.string.majorEncoded, z.array.majorEncoded, z.float.majorEncoded | 20, z.float.majorEncoded | 21, z.float.majorEncoded | 22, z.float.majorEncoded | 23;
function lp(e, t, n, r) {
	let i = r instanceof Uint8Array, a = i ? new Ed(r) : ep, o = ip(e, n);
	if (!Array.isArray(o) && n.quickEncodeToken) {
		let e = n.quickEncodeToken(o);
		if (e) return i ? (a.push(e), a.toBytes()) : e;
		let r = t[o.type.major];
		if (r.encodedSize) {
			let e = r.encodedSize(o, n);
			if (i || (a = new Td(e)), r(a, o, n), a.chunks.length !== 1) throw Error(`Unexpected error: pre-calculated length for ${o} was wrong`);
			return i ? a.toBytes() : fd(a.chunks[0]);
		}
	}
	return a.reset(), cp(a, o, t, n), a.toBytes(!0);
}
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/decode.js
var up = {
	strict: !1,
	allowIndefinite: !0,
	allowUndefined: !0,
	allowBigInt: !0
}, dp = class {
	constructor(e, t = {}) {
		this._pos = 0, this.data = e, this.options = t;
	}
	pos() {
		return this._pos;
	}
	done() {
		return this._pos >= this.data.length;
	}
	next() {
		let e = this.data[this._pos], t = Yf[e];
		if (t === void 0) {
			let n = K[e];
			if (!n) throw Error(`${V} no decoder for major type ${e >>> 5} (byte 0x${e.toString(16).padStart(2, "0")})`);
			let r = e & 31;
			t = n(this.data, this._pos, r, this.options);
		}
		return this._pos += t.encodedLength, t;
	}
}, fp = Symbol.for("DONE"), pp = Symbol.for("BREAK");
function mp(e, t, n) {
	let r = [];
	for (let i = 0; i < e.value; i++) {
		let a = vp(t, n);
		if (a === pp) {
			if (e.value === Infinity) break;
			throw Error(`${V} got unexpected break to lengthed array`);
		}
		if (a === fp) throw Error(`${V} found array but not enough entries (got ${i}, expected ${e.value})`);
		r[i] = a;
	}
	return r;
}
function hp(e, t, n) {
	let r = n.useMaps === !0, i = n.rejectDuplicateMapKeys === !0, a = r ? void 0 : {}, o = r ? /* @__PURE__ */ new Map() : void 0;
	for (let s = 0; s < e.value; s++) {
		let c = vp(t, n);
		if (c === pp) {
			if (e.value === Infinity) break;
			throw Error(`${V} got unexpected break to lengthed map`);
		}
		if (c === fp) throw Error(`${V} found map but not enough entries (got ${s} [no key], expected ${e.value})`);
		if (!r && typeof c != "string") throw Error(`${V} non-string keys not supported (got ${typeof c})`);
		if (i && (r && o.has(c) || !r && Object.hasOwn(a, c))) throw Error(`${V} found repeat map key "${c}"`);
		let l = vp(t, n);
		if (l === fp) throw Error(`${V} found map but not enough entries (got ${s} [no value], expected ${e.value})`);
		r ? o.set(c, l) : a[c] = l;
	}
	return r ? o : a;
}
function* gp(e, t, n) {
	for (let r = 0; r < e.value; r++) {
		let i = vp(t, n);
		if (i === pp) {
			if (e.value === Infinity) break;
			throw Error(`${V} got unexpected break to lengthed map`);
		}
		if (i === fp) throw Error(`${V} found map but not enough entries (got ${r} [no key], expected ${e.value})`);
		let a = vp(t, n);
		if (a === fp) throw Error(`${V} found map but not enough entries (got ${r} [no value], expected ${e.value})`);
		yield [i, a];
	}
}
function _p(e, t) {
	let n = !1, r = function() {
		if (n) throw Error(`${V} tag decode() may only be called once`);
		n = !0;
		let r = vp(e, t);
		if (r === fp) throw Error(`${V} tag content missing`);
		if (r === pp) throw Error(`${V} got unexpected break in tag content`);
		return r;
	};
	return r.entries = function() {
		if (n) throw Error(`${V} tag decode() may only be called once`);
		n = !0;
		let r = e.next();
		if (!z.equals(r.type, z.map)) throw Error(`${V} entries() requires map content, got ${r.type.name}`);
		let i = [];
		for (let n of gp(r, e, t)) i.push(n);
		return i;
	}, Object.defineProperty(r, "_called", {
		get() {
			return n;
		},
		enumerable: !1
	}), r;
}
function vp(e, t) {
	if (e.done()) return fp;
	let n = e.next();
	if (z.equals(n.type, z.break)) return pp;
	if (n.type.terminal) return n.value;
	if (z.equals(n.type, z.array)) return mp(n, e, t);
	if (z.equals(n.type, z.map)) return hp(n, e, t);
	if (z.equals(n.type, z.tag)) {
		if (t.tags && typeof t.tags[n.value] == "function") {
			let r = _p(e, t), i = t.tags[n.value](r);
			if (!r._called) throw Error(`${V} tag decoder must call decode() or entries()`);
			return i;
		}
		throw Error(`${V} tag not supported (${n.value})`);
	}
	throw Error("unsupported");
}
function yp(e, t) {
	if (!(e instanceof Uint8Array)) throw Error(`${V} data to decode must be a Uint8Array`);
	t = Object.assign({}, up, t);
	let n = fd(e), r = t.tokenizer || new dp(n, t), i = vp(r, t);
	if (i === fp) throw Error(`${V} did not find any content to decode`);
	if (i === pp) throw Error(`${V} got unexpected break`);
	return [i, e.subarray(r.pos())];
}
function bp(e, t) {
	let [n, r] = yp(e, t);
	if (r.length > 0) throw Error(`${V} too many terminals, data makes no sense`);
	return n;
}
Object.defineProperty(class e {
	constructor(e, t) {
		if (typeof e != "number" || !Number.isInteger(e) || e < 0) throw TypeError("Tagged: tag must be a non-negative integer");
		this.tag = e, this.value = t;
	}
	static decoder(t) {
		return (n) => new e(t, n());
	}
	static preserve(...t) {
		let n = {};
		for (let r of t) n[r] = e.decoder(r);
		return n;
	}
}.prototype, Symbol.toStringTag, { value: "Tagged" });
// node_modules/.pnpm/@ipld+dag-cbor@9.2.7/node_modules/@ipld/dag-cbor/src/index.js
var xp = 42;
function Sp(e) {
	return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
function Cp(e) {
	if (e.asCID !== e && e["/"] !== e.bytes) return null;
	let t = N.asCID(e);
	/* c8 ignore next 4 */
	if (!t) return null;
	let n = new Uint8Array(t.bytes.byteLength + 1);
	return n.set(t.bytes, 1), [new B(z.tag, xp), new B(z.bytes, n)];
}
function wp() {
	throw Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
function Tp(e) {
	if (Number.isNaN(e)) throw Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
	if (e === Infinity || e === -Infinity) throw Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
	return null;
}
function Ep(e) {
	for (let t of e.keys()) if (typeof t != "string" || t.length === 0) throw Error("Non-string Map keys are not supported by the IPLD Data Model and cannot be encoded");
	return null;
}
var Dp = {
	float64: !0,
	typeEncoders: {
		Map: Ep,
		Object: Cp,
		undefined: wp,
		number: Tp
	}
};
({ ...Dp }), { ...Dp.typeEncoders };
function Op(e) {
	let t = e();
	if (t[0] !== 0) throw Error("Invalid CID for CBOR tag 42; expected leading 0x00");
	return N.decode(t.subarray(1));
}
var kp = {
	allowIndefinite: !1,
	coerceUndefinedToNull: !0,
	allowNaN: !1,
	allowInfinity: !1,
	allowBigInt: !0,
	strict: !0,
	useMaps: !1,
	rejectDuplicateMapKeys: !0,
	tags: { [xp]: Op }
};
({ ...kp }), { ...kp.tags };
var Ap = (e) => bp(Sp(e), kp);
z.uint.major, z.negint.major, z.bytes.major, z.string.major, z.array.major, z.map.major, z.tag.major, z.float.major;
// node_modules/.pnpm/cborg@5.1.11/node_modules/cborg/lib/json/decode.js
var jp = class {
	constructor(e, t = {}) {
		this._pos = 0, this.data = e, this.options = t, this.modeStack = ["value"], this.lastToken = "";
	}
	pos() {
		return this._pos;
	}
	done() {
		return this._pos >= this.data.length;
	}
	ch() {
		return this.data[this._pos];
	}
	currentMode() {
		return this.modeStack[this.modeStack.length - 1];
	}
	skipWhitespace() {
		let e = this.ch();
		for (; e === 32 || e === 9 || e === 13 || e === 10;) e = this.data[++this._pos];
	}
	expect(e) {
		if (this.data.length - this._pos < e.length) throw Error(`${V} unexpected end of input at position ${this._pos}`);
		for (let t = 0; t < e.length; t++) if (this.data[this._pos++] !== e[t]) throw Error(`${V} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...e)}'`);
	}
	parseNumber() {
		let e = this._pos, t = !1, n = !1, r = (e) => {
			for (; !this.done();) {
				let t = this.ch();
				if (e.includes(t)) this._pos++;
				else break;
			}
		};
		if (this.ch() === 45 && (t = !0, this._pos++), this.ch() === 48) {
			if (this._pos++, this.ch() === 46) this._pos++, n = !0;
			else return new B(z.uint, 0, this._pos - e);
		}
		if (r([
			48,
			49,
			50,
			51,
			52,
			53,
			54,
			55,
			56,
			57
		]), t && this._pos === e + 1) throw Error(`${V} unexpected token at position ${this._pos}`);
		if (!this.done() && this.ch() === 46) {
			if (n) throw Error(`${V} unexpected token at position ${this._pos}`);
			n = !0, this._pos++, r([
				48,
				49,
				50,
				51,
				52,
				53,
				54,
				55,
				56,
				57
			]);
		}
		this.done() || this.ch() !== 101 && this.ch() !== 69 || (n = !0, this._pos++, this.done() || this.ch() !== 43 && this.ch() !== 45 || this._pos++, r([
			48,
			49,
			50,
			51,
			52,
			53,
			54,
			55,
			56,
			57
		]));
		let i = String.fromCharCode.apply(null, this.data.subarray(e, this._pos)), a = parseFloat(i);
		return n ? new B(z.float, a, this._pos - e) : this.options.allowBigInt !== !0 || Number.isSafeInteger(a) ? new B(a >= 0 ? z.uint : z.negint, a, this._pos - e) : new B(a >= 0 ? z.uint : z.negint, BigInt(i), this._pos - e);
	}
	parseString() {
		if (this.ch() !== 34) throw Error(`${V} unexpected character at position ${this._pos}; this shouldn't happen`);
		this._pos++;
		for (let e = this._pos, t = 0; e < this.data.length && t < 65536; e++, t++) {
			let n = this.data[e];
			if (n === 92 || n < 32 || n >= 128) break;
			if (n === 34) {
				let n = String.fromCharCode.apply(null, this.data.subarray(this._pos, e));
				return this._pos = e + 1, new B(z.string, n, t);
			}
		}
		let e = this._pos, t = [], n = () => {
			if (this._pos + 4 >= this.data.length) throw Error(`${V} unexpected end of unicode escape sequence at position ${this._pos}`);
			let e = 0;
			for (let t = 0; t < 4; t++) {
				let t = this.ch();
				if (t >= 48 && t <= 57) t -= 48;
				else if (t >= 97 && t <= 102) t = t - 97 + 10;
				else if (t >= 65 && t <= 70) t = t - 65 + 10;
				else throw Error(`${V} unexpected unicode escape character at position ${this._pos}`);
				e = e * 16 + t, this._pos++;
			}
			return e;
		}, r = () => {
			let e = this.ch(), n = null, r = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
			if (this._pos + r > this.data.length) throw Error(`${V} unexpected unicode sequence at position ${this._pos}`);
			let i, a, o, s;
			switch (r) {
				case 1:
					e < 128 && (n = e);
					break;
				case 2:
					i = this.data[this._pos + 1], (i & 192) == 128 && (s = (e & 31) << 6 | i & 63, s > 127 && (n = s));
					break;
				case 3:
					i = this.data[this._pos + 1], a = this.data[this._pos + 2], (i & 192) == 128 && (a & 192) == 128 && (s = (e & 15) << 12 | (i & 63) << 6 | a & 63, s > 2047 && (s < 55296 || s > 57343) && (n = s));
					break;
				case 4: i = this.data[this._pos + 1], a = this.data[this._pos + 2], o = this.data[this._pos + 3], (i & 192) == 128 && (a & 192) == 128 && (o & 192) == 128 && (s = (e & 15) << 18 | (i & 63) << 12 | (a & 63) << 6 | o & 63, s > 65535 && s < 1114112 && (n = s));
			}
			n === null ? (n = 65533, r = 1) : n > 65535 && (n -= 65536, t.push(n >>> 10 & 1023 | 55296), n = 56320 | n & 1023), t.push(n), this._pos += r;
		};
		for (; !this.done();) {
			let i = this.ch(), a;
			switch (i) {
				case 92:
					if (this._pos++, this.done()) throw Error(`${V} unexpected string termination at position ${this._pos}`);
					switch (a = this.ch(), this._pos++, a) {
						case 34:
						case 39:
						case 92:
						case 47:
							t.push(a);
							break;
						case 98:
							t.push(8);
							break;
						case 116:
							t.push(9);
							break;
						case 110:
							t.push(10);
							break;
						case 102:
							t.push(12);
							break;
						case 114:
							t.push(13);
							break;
						case 117:
							t.push(n());
							break;
						default: throw Error(`${V} unexpected string escape character at position ${this._pos}`);
					}
					break;
				case 34: return this._pos++, new B(z.string, Cd(t), this._pos - e);
				default:
					if (i < 32) throw Error(`${V} invalid control character at position ${this._pos}`);
					i < 128 ? (t.push(i), this._pos++) : r();
			}
		}
		throw Error(`${V} unexpected end of string at position ${this._pos}`);
	}
	parseValue() {
		switch (this.ch()) {
			case 123: return this.modeStack.push("obj-start"), this._pos++, new B(z.map, Infinity, 1);
			case 91: return this.modeStack.push("array-start"), this._pos++, new B(z.array, Infinity, 1);
			case 34: return this.parseString();
			case 110: return this.expect([
				110,
				117,
				108,
				108
			]), new B(z.null, null, 4);
			case 102: return this.expect([
				102,
				97,
				108,
				115,
				101
			]), new B(z.false, !1, 5);
			case 116: return this.expect([
				116,
				114,
				117,
				101
			]), new B(z.true, !0, 4);
			case 45:
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57: return this.parseNumber();
			default: throw Error(`${V} unexpected character at position ${this._pos}`);
		}
	}
	next() {
		switch (this.skipWhitespace(), this.currentMode()) {
			case "value": return this.modeStack.pop(), this.parseValue();
			case "array-value":
				if (this.modeStack.pop(), this.ch() === 93) return this._pos++, this.skipWhitespace(), new B(z.break, void 0, 1);
				if (this.ch() !== 44) throw Error(`${V} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
				return this._pos++, this.modeStack.push("array-value"), this.skipWhitespace(), this.parseValue();
			case "array-start": return this.modeStack.pop(), this.ch() === 93 ? (this._pos++, this.skipWhitespace(), new B(z.break, void 0, 1)) : (this.modeStack.push("array-value"), this.skipWhitespace(), this.parseValue());
			case "obj-key":
				if (this.ch() === 125) return this.modeStack.pop(), this._pos++, this.skipWhitespace(), new B(z.break, void 0, 1);
				if (this.ch() !== 44) throw Error(`${V} unexpected character at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
				this._pos++, this.skipWhitespace();
			case "obj-start": {
				if (this.modeStack.pop(), this.ch() === 125) return this._pos++, this.skipWhitespace(), new B(z.break, void 0, 1);
				let e = this.parseString();
				if (this.skipWhitespace(), this.ch() !== 58) throw Error(`${V} unexpected character at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
				return this._pos++, this.modeStack.push("obj-value"), e;
			}
			case "obj-value": return this.modeStack.pop(), this.modeStack.push("obj-key"), this.skipWhitespace(), this.parseValue();
			default: throw Error(`${V} unexpected parse state at position ${this._pos}; this shouldn't happen`);
		}
	}
};
function Mp(e, t) {
	return t = Object.assign({ tokenizer: new jp(e, t) }, t), bp(e, t);
}
// node_modules/.pnpm/@ipld+dag-json@10.2.9/node_modules/@ipld/dag-json/src/index.js
function Np(e) {
	return e instanceof ArrayBuffer ? new Uint8Array(e, 0, e.byteLength) : e;
}
var Pp = class extends jp {
	constructor(e, t) {
		super(e, t), this.tokenBuffer = [];
	}
	done() {
		return this.tokenBuffer.length === 0 && super.done();
	}
	_next() {
		return this.tokenBuffer.length > 0 ? this.tokenBuffer.pop() : super.next();
	}
	next() {
		let e = this._next();
		if (z.equals(e.type, z.map)) {
			let e = this._next();
			if (z.equals(e.type, z.string) && e.value === "/") {
				let e = this._next();
				if (z.equals(e.type, z.string)) {
					let t = this._next();
					if (!z.equals(t.type, z.break)) throw Error("Invalid encoded CID form");
					return this.tokenBuffer.push(e), new B(z.tag, 42, 0);
				}
				if (z.equals(e.type, z.map)) {
					let e = this._next();
					if (z.equals(e.type, z.string) && e.value === "bytes") {
						let e = this._next();
						if (z.equals(e.type, z.string)) {
							for (let e = 0; e < 2; e++) {
								let e = this._next();
								if (!z.equals(e.type, z.break)) throw Error("Invalid encoded Bytes form");
							}
							let t = Oo.decode(`m${e.value}`);
							return new B(z.bytes, t, e.value.length);
						}
						this.tokenBuffer.push(e);
					}
					this.tokenBuffer.push(e);
				}
				this.tokenBuffer.push(e);
			}
			this.tokenBuffer.push(e);
		}
		return e;
	}
}, Fp = {
	allowIndefinite: !1,
	allowUndefined: !1,
	allowNaN: !1,
	allowInfinity: !1,
	allowBigInt: !0,
	strict: !0,
	useMaps: !1,
	rejectDuplicateMapKeys: !0,
	tags: { 42: (e) => N.parse(e()) }
}, Ip = (e) => {
	let t = Np(e);
	return Mp(t, Object.assign(Fp, { tokenizer: new Pp(t, Fp) }));
};
new TextDecoder(), new TextEncoder();
// node_modules/.pnpm/it-to-buffer@4.0.12/node_modules/it-to-buffer/dist/src/index.js
function Lp(e) {
	return e[Symbol.asyncIterator] != null;
}
function q(e) {
	if (Lp(e)) return (async () => {
		let t = /* @__PURE__ */ new Uint8Array();
		for await (let n of e) t = gi([t, n], t.length + n.length);
		return t;
	})();
	let t = [], n = 0;
	for (let r of e) t.push(r), n += r.byteLength;
	return gi(t, n);
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/utils/is-cid.js
function Rp(e) {
	return e != null && N.asCID(e) === e;
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/utils/resolve-object-path.js
function zp(e, t) {
	let n, r = 0, i = "";
	for (; r < t.length;) {
		let a = t[r];
		if (r++, !Object.hasOwnProperty.call(e, a)) throw new ed(`Object did not have key "${a}"`);
		if (i += `/${a}`, n = e[a], e = n, Rp(n)) break;
	}
	return {
		value: n,
		rest: t.slice(r),
		path: i.substring(1)
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/dag-cbor.js
async function* Bp(e, t, n, r) {
	let i = zp(Ap(await q(n.get(e, r))), t);
	yield {
		cid: Rp(i.value) ? i.value : e,
		name: i.path,
		rest: i.rest
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/dag-json.js
async function* Vp(e, t, n, r) {
	let i = zp(Ip(await q(n.get(e, r))), t);
	yield {
		cid: Rp(i.value) ? i.value : e,
		name: i.path,
		rest: i.rest
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/utils/find-cid-in-shard.js
var Hp = async function(e) {
	return (await hl.encode(e)).slice(0, 8).reverse();
}, Up = async (e, t, n) => {
	let r = (t.tableSize() - 1).toString(16).length;
	await Promise.all(e.map(async (e) => {
		if (e.Name == null) throw Error("Unexpected Link without a Name");
		if (e.Name.length === r) {
			let r = parseInt(e.Name, 16);
			t._putObjectAt(r, new su({
				hash: n._options.hash,
				bits: n._options.bits
			}, t, r));
		} else await n.put(e.Name.substring(2), !0);
	}));
}, Wp = (e, t) => e.toString(16).toUpperCase().padStart(t, "0").substring(0, t), Gp = (e) => {
	let t = e.bucket, n = [];
	for (; t._parent != null;) n.push(t), t = t._parent;
	return n.push(t), n.reverse();
};
async function* Kp(e, t, n, r, i, a) {
	if (i == null) {
		if (e.Data == null) throw new R("No data in PBNode");
		let t;
		try {
			t = P.unmarshal(e.Data);
		} catch (e) {
			throw new R(e.message);
		}
		if (t.type !== "hamt-sharded-directory") throw new R("Not a HAMT");
		if (t.fanout == null) throw new R("Missing fanout");
		let n = Su({
			hashFn: Hp,
			bits: Math.log2(Number(t.fanout))
		});
		i = {
			rootBucket: n,
			hamtDepth: 1,
			lastBucket: n
		};
	}
	let o = (i.lastBucket.tableSize() - 1).toString(16).length;
	await Up(e.Links, i.lastBucket, i.rootBucket);
	let s = await i.rootBucket._findNewBucketAndPos(t), c = Wp(s.pos, o), l = Gp(s);
	l.length > i.hamtDepth && (i.lastBucket = l[i.hamtDepth], c = Wp(i.lastBucket._posAtParent, o));
	let u = e.Links.find((e) => {
		if (e.Name == null) return !1;
		let n = e.Name.substring(0, o), r = e.Name.substring(o);
		return !(n !== c || r !== "" && r !== t);
	});
	u != null && (u.Name != null && u.Name.substring(o) === t ? yield {
		cid: u.Hash,
		name: u.Name.substring(o),
		rest: n
	} : (i.hamtDepth++, e = k(await q(r.get(u.Hash, a))), a?.yieldSubShards === !0 && (yield {
		cid: u.Hash,
		name: u.Name ?? "",
		rest: [t, ...n]
	}), yield* Kp(e, t, n, r, i, a)));
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/dag-pb.js
async function* qp(e, t, n, r) {
	let i = await q(n.get(e, r)), a;
	try {
		a = k(i);
	} catch (e) {
		throw new R(e.message);
	}
	if (a.Data == null) throw new R("no data in PBNode");
	let o;
	try {
		o = P.unmarshal(a.Data);
	} catch (e) {
		throw new R(e.message);
	}
	if (o.type === "directory" || o.type === "hamt-sharded-directory" && r?.translateHAMTPath === !1) {
		let n = a.Links.find((e) => e.Name === t[0]);
		if (n == null) throw new td(`No link "${t[0]}" found under ${e}`);
		yield {
			cid: n.Hash,
			name: t[0],
			rest: t.slice(1)
		};
	} else if (o.type === "hamt-sharded-directory") {
		let i = !1;
		for await (let e of Kp(a, t[0], t.slice(1), n, void 0, r)) e.name === t[0] && (i = !0), yield e;
		if (!i) throw new td(`No link "${t[0]}" found under ${e}`);
	}
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/identity.js
async function* Jp(e, t, n, r) {
	if (t.length !== 0) throw new ed(`Cannot load path /${t.join("/")} from identity block`);
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/json.js
async function* Yp(e, t, n, r) {
	let i = zp(Lo(await q(n.get(e, r))), t);
	yield {
		cid: e,
		name: i.path,
		rest: i.rest
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/raw.js
async function* Xp(e, t, n, r) {
	if (t.length !== 0) throw new td(`Cannot load path /${t.join("/")} from raw block`);
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/walk-path/index.js
var Zp = {
	112: qp,
	85: Xp,
	113: Bp,
	81: Bp,
	297: Vp,
	[vs.code]: Jp,
	512: Yp
};
async function* Qp(e, t, n = {}) {
	for (e = e.toString(), e.startsWith("/ipfs/") && (e = e.substring(6)); e.endsWith("/");) e = e.substring(0, e.length - 1);
	let [r, ...i] = e.split(/(?<!\\)\//g).filter(Boolean), a = N.parse(r), o = [a], s = `${a}`;
	for (yield {
		cid: a,
		name: s,
		path: s,
		roots: o,
		remainder: i
	}; i.length > 0;) {
		let e = Zp[a.code];
		if (e == null) throw new nd(`No resolver for code ${a.code}`);
		let r = !1;
		for await (let c of e(a, i, t, n)) {
			if (a = c.cid, r = !o[o.length - 1].equals(a), i = c.rest, !r) break;
			o = [...o, c.cid], s = `${s}/${c.name}`, yield {
				cid: c.cid,
				name: c.name,
				path: s,
				roots: o,
				remainder: c.rest
			};
		}
		if (!r) break;
	}
	if (n?.signal?.throwIfAborted(), i.length !== 0) throw new td(`Could not resolve path /${i.join("/")} under ${e}`);
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/dag-cbor.js
async function $p(e, t, n, r, i) {
	let a = await q(r.get(e, i));
	return {
		type: "object",
		cid: e,
		name: t,
		path: n,
		object: Ap(a),
		node: a
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/dag-json.js
async function em(e, t, n, r, i) {
	let a = await q(r.get(e, i));
	return {
		type: "object",
		cid: e,
		name: t,
		path: n,
		object: Ip(a),
		node: a
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/utils/extract-data-from-block.js
function tm(e, t, n, r) {
	let i = BigInt(e.length), a = BigInt(t + i);
	return n >= a || r < t ? /* @__PURE__ */ new Uint8Array() : (r >= t && r < a && (e = e.subarray(0, Number(r - t))), n >= t && n < a && (e = e.subarray(Number(n - t))), e);
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/utils/validate-offset-and-length.js
var nm = (e, t = 0, n = e) => {
	let r = BigInt(e), i = BigInt(t ?? 0), a = BigInt(n);
	if (a !== r && (a = i + a), a > r && (a = r), i < 0n) throw new ad("Offset must be greater than or equal to 0");
	if (i > r) throw new ad("Offset must be less than the file size");
	if (a < 0n) throw new ad("Length must be greater than or equal to 0");
	if (a > r) throw new ad("Length must be less than the file size");
	return {
		start: i,
		end: a
	};
};
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/utils/raw-content.js
function rm(e, t) {
	async function* n(n = {}) {
		let { start: r, end: i } = nm(e.length, n.offset, n.length), a = tm(e, 0n, r, i);
		n.onProgress?.(new yc(t, {
			bytesRead: BigInt(a.byteLength),
			totalBytes: i - r,
			fileSize: BigInt(e.byteLength)
		})), yield a;
	}
	return n;
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/identity.js
async function im(e, t, n, r, i) {
	let a = us(e.multihash.bytes);
	return {
		type: "identity",
		cid: e,
		name: t,
		path: n,
		content: rm(a.digest, "unixfs:exporter:progress:identity"),
		size: BigInt(a.bytes.length),
		node: a.bytes
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/json.js
async function am(e, t, n, r, i) {
	let a = await q(r.get(e, i));
	return {
		type: "object",
		cid: e,
		name: t,
		path: n,
		object: Lo(a),
		node: a
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/raw.js
async function om(e, t, n, r, i) {
	let a = await q(r.get(e, i));
	return {
		type: "raw",
		cid: e,
		name: t,
		path: n,
		content: rm(a, "unixfs:exporter:progress:raw"),
		size: BigInt(a.length),
		node: a
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/unixfs-v1/content/directory.js
function sm(e, t, n, r) {
	async function* i(n = {}) {
		let i = n.offset ?? 0, a = n.length ?? t.Links.length, o = t.Links.slice(i, a);
		n.onProgress?.(new yc("unixfs:exporter:walk:directory", { cid: e })), yield* o.map((e) => ({
			cid: e.Hash,
			name: e.Name ?? "",
			path: `${r}/${e.Name ?? ""}`
		}));
	}
	return i;
}
// node_modules/.pnpm/it-peekable@3.0.10/node_modules/it-peekable/dist/src/index.js
function cm(e) {
	let [t, n] = e[Symbol.asyncIterator] == null ? [e[Symbol.iterator](), Symbol.iterator] : [e[Symbol.asyncIterator](), Symbol.asyncIterator], r = [];
	return {
		peek: () => t.next(),
		push: (e) => {
			r.push(e);
		},
		next: () => r.length > 0 ? {
			done: !1,
			value: r.shift()
		} : t.next(),
		[n]() {
			return this;
		}
	};
}
// node_modules/.pnpm/it-map@3.1.6/node_modules/it-map/dist/src/index.js
function lm(e) {
	return e[Symbol.asyncIterator] != null;
}
function um(e, t) {
	let n = 0;
	if (lm(e)) return (async function* () {
		for await (let r of e) yield t(r, n++);
	})();
	let r = cm(e), { value: i, done: a } = r.next();
	if (a === !0) return function* () {}();
	let o = t(i, n++);
	if (typeof o.then == "function") return (async function* () {
		yield await o;
		for (let e of r) yield t(e, n++);
	})();
	let s = t;
	return (function* () {
		yield o;
		for (let e of r) yield s(e, n++);
	})();
}
// node_modules/.pnpm/p-defer@4.0.1/node_modules/p-defer/index.js
function dm() {
	let e = {};
	return e.promise = new Promise((t, n) => {
		e.resolve = t, e.reject = n;
	}), e;
}
// node_modules/.pnpm/it-parallel@3.0.16/node_modules/it-parallel/dist/src/index.js
var fm = globalThis.CustomEvent ?? Event;
async function* pm(e, t = {}) {
	let n = t.concurrency ?? Infinity;
	n < 1 && (n = Infinity);
	let r = t.ordered ?? !1, i = new EventTarget(), a = [], o = dm(), s = dm(), c = !1, l, u = !1, d = !1;
	i.addEventListener("task-complete", () => {
		s.resolve();
	}), Promise.resolve().then(async () => {
		try {
			for await (let t of e) {
				if (a.length === n && (o = dm(), await o.promise), u || d) break;
				let e = { done: !1 };
				a.push(e), t().then((t) => {
					e.done = !0, e.ok = !0, e.value = t, i.dispatchEvent(new fm("task-complete"));
				}, (t) => {
					e.done = !0, e.err = t, i.dispatchEvent(new fm("task-complete"));
				});
			}
			c = !0, i.dispatchEvent(new fm("task-complete"));
		} catch (e) {
			l = e, i.dispatchEvent(new fm("task-complete"));
		}
	});
	function f() {
		return r ? a[0]?.done : !!a.find((e) => e.done);
	}
	function* p() {
		for (; a.length > 0 && a[0].done;) {
			let e = a[0];
			if (a.shift(), e.ok) yield e.value;
			else throw u = !0, o.resolve(), e.err;
			o.resolve();
		}
	}
	function* m() {
		for (; f();) for (let e = 0; e < a.length; e++) if (a[e].done) {
			let t = a[e];
			if (a.splice(e, 1), e--, t.ok) yield t.value;
			else throw u = !0, o.resolve(), t.err;
			o.resolve();
		}
	}
	try {
		for (;;) {
			if (f() || (s = dm(), await s.promise), l != null || (r ? yield* p() : yield* m(), l != null)) throw l;
			if (c && a.length === 0) break;
		}
	} finally {
		d = !0, o.resolve();
	}
}
// node_modules/.pnpm/it-pushable@3.2.4/node_modules/it-pushable/dist/src/fifo.js
var mm = class {
	buffer;
	mask;
	top;
	btm;
	next;
	constructor(e) {
		if (!(e > 0) || e - 1 & e) throw Error("Max size for a FixedFIFO should be a power of two");
		this.buffer = Array(e), this.mask = e - 1, this.top = 0, this.btm = 0, this.next = null;
	}
	push(e) {
		return this.buffer[this.top] === void 0 && (this.buffer[this.top] = e, this.top = this.top + 1 & this.mask, !0);
	}
	shift() {
		let e = this.buffer[this.btm];
		if (e !== void 0) return this.buffer[this.btm] = void 0, this.btm = this.btm + 1 & this.mask, e;
	}
	isEmpty() {
		return this.buffer[this.btm] === void 0;
	}
}, hm = class {
	size;
	hwm;
	head;
	tail;
	constructor(e = {}) {
		this.hwm = e.splitLimit ?? 16, this.head = new mm(this.hwm), this.tail = this.head, this.size = 0;
	}
	calculateSize(e) {
		return e?.byteLength == null ? 1 : e.byteLength;
	}
	push(e) {
		if (e?.value != null && (this.size += this.calculateSize(e.value)), !this.head.push(e)) {
			let t = this.head;
			this.head = t.next = new mm(2 * this.head.buffer.length), this.head.push(e);
		}
	}
	shift() {
		let e = this.tail.shift();
		if (e === void 0 && this.tail.next != null) {
			let t = this.tail.next;
			this.tail.next = null, this.tail = t, e = this.tail.shift();
		}
		return e?.value != null && (this.size -= this.calculateSize(e.value)), e;
	}
	isEmpty() {
		return this.head.isEmpty();
	}
}, gm = class extends Error {
	type;
	code;
	constructor(e, t) {
		super(e ?? "The operation was aborted"), this.type = "aborted", this.code = t ?? "ABORT_ERR";
	}
};
function _m(e = {}) {
	return vm((e) => {
		let t = e.shift();
		if (t == null) return { done: !0 };
		if (t.error != null) throw t.error;
		return {
			done: t.done === !0,
			value: t.value
		};
	}, e);
}
function vm(e, t) {
	t ??= {};
	let n = t.onEnd, r = new hm(), i, a, o, s = dm(), c = async () => {
		try {
			return r.isEmpty() ? o ? { done: !0 } : await new Promise((t, n) => {
				a = (o) => {
					a = null, r.push(o);
					try {
						t(e(r));
					} catch (e) {
						n(e);
					}
					return i;
				};
			}) : e(r);
		} finally {
			r.isEmpty() && queueMicrotask(() => {
				s.resolve(), s = dm();
			});
		}
	}, l = (e) => a == null ? (r.push(e), i) : a(e), u = (e) => (r = new hm(), a == null ? (r.push({ error: e }), i) : a({ error: e })), d = (e) => {
		if (o) return i;
		if (t?.objectMode !== !0 && e?.byteLength == null) throw Error("objectMode was not true but tried to push non-Uint8Array value");
		return l({
			done: !1,
			value: e
		});
	}, f = (e) => o ? i : (o = !0, e == null ? l({ done: !0 }) : u(e)), p = () => (r = new hm(), f(), { done: !0 }), m = (e) => (f(e), { done: !0 });
	if (i = {
		[Symbol.asyncIterator]() {
			return this;
		},
		next: c,
		return: p,
		throw: m,
		push: d,
		end: f,
		get readableLength() {
			return r.size;
		},
		onEmpty: async (e) => {
			let t = e?.signal;
			if (t?.throwIfAborted(), r.isEmpty()) return;
			let n, i;
			t != null && (n = new Promise((e, n) => {
				i = () => {
					n(new gm());
				}, t.addEventListener("abort", i);
			}));
			try {
				await Promise.race([s.promise, n]);
			} finally {
				i != null && t != null && t?.removeEventListener("abort", i);
			}
		}
	}, n == null) return i;
	let h = i;
	return i = {
		[Symbol.asyncIterator]() {
			return this;
		},
		next() {
			return h.next();
		},
		throw(e) {
			return h.throw(e), n != null && (n(e), n = void 0), { done: !0 };
		},
		return() {
			return h.return(), n != null && (n(), n = void 0), { done: !0 };
		},
		push: d,
		end(e) {
			return h.end(e), n != null && (n(e), n = void 0), i;
		},
		get readableLength() {
			return h.readableLength;
		},
		onEmpty: (e) => h.onEmpty(e)
	}, i;
}
// node_modules/.pnpm/race-signal@2.0.2/node_modules/race-signal/dist/src/index.js
function ym(e) {
	return e.reason;
}
function bm(e, t, n) {
	if (t == null || e == null) return e;
	let r = n?.translateError ?? ym;
	if (t.aborted) return e.catch(() => {}), Promise.reject(r(t));
	let i;
	return Promise.race([e, new Promise((e, n) => {
		i = () => {
			n(r(t));
		}, t.addEventListener("abort", i);
	})]).finally(() => {
		i != null && t.removeEventListener("abort", i);
	});
}
// node_modules/.pnpm/it-queueless-pushable@2.0.5/node_modules/it-queueless-pushable/dist/src/index.js
var xm = class {
	readNext;
	haveNext;
	ended;
	nextResult;
	error;
	constructor() {
		this.ended = !1, this.readNext = dm(), this.haveNext = dm();
	}
	[Symbol.asyncIterator]() {
		return this;
	}
	async next() {
		if (this.nextResult ?? await this.haveNext.promise, this.nextResult == null) throw Error("HaveNext promise resolved but nextResult was undefined");
		let e = this.nextResult;
		return this.nextResult = void 0, this.readNext.resolve(), this.readNext = dm(), e;
	}
	async throw(e) {
		return this.ended = !0, this.error = e, e != null && (this.haveNext.promise.catch(() => {}), this.haveNext.reject(e)), {
			done: !0,
			value: void 0
		};
	}
	async return() {
		let e = {
			done: !0,
			value: void 0
		};
		return this.ended = !0, this.nextResult = e, this.haveNext.resolve(), e;
	}
	async push(e, t) {
		await this._push(e, t);
	}
	async end(e, t) {
		e == null ? await this._push(void 0, t) : await this.throw(e);
	}
	async _push(e, t) {
		if (e != null && this.ended) throw this.error ?? /* @__PURE__ */ Error("Cannot push value onto an ended pushable");
		for (; this.nextResult != null;) await this.readNext.promise;
		e == null ? (this.ended = !0, this.nextResult = {
			done: !0,
			value: void 0
		}) : this.nextResult = {
			done: !1,
			value: e
		}, this.haveNext.resolve(), this.haveNext = dm(), await bm(this.readNext.promise, t?.signal, t);
	}
};
function Sm() {
	return new xm();
}
// node_modules/.pnpm/it-merge@3.0.15/node_modules/it-merge/dist/src/index.js
function Cm(e) {
	return e[Symbol.asyncIterator] != null;
}
async function wm(e, t, n) {
	try {
		await Promise.all(e.map(async (e) => {
			for (;;) {
				let { value: r, done: i } = await e.next();
				if (i === !0) break;
				await t.push(r, { signal: n }), n.throwIfAborted();
			}
		})), await t.end(void 0, { signal: n });
	} catch (e) {
		await t.end(e, { signal: n }).catch(() => {});
	}
}
async function* Tm(e) {
	let t = new AbortController(), n = Sm(), r = e.map((e) => Cm(e) ? e[Symbol.asyncIterator]() : e[Symbol.iterator]());
	wm(r, n, t.signal).catch(() => {});
	try {
		yield* n;
	} finally {
		t.abort();
		for (let e of r) try {
			Promise.resolve(e.return?.()).catch(() => {});
		} catch {}
	}
}
function* Em(e) {
	for (let t of e) yield* t;
}
function Dm(...e) {
	let t = [];
	for (let n of e) Cm(n) || t.push(n);
	return t.length === e.length ? Em(t) : Tm(e);
}
// node_modules/.pnpm/it-pipe@3.0.1/node_modules/it-pipe/dist/src/index.js
function Om(e, ...t) {
	if (e == null) throw Error("Empty pipeline");
	if (Mm(e)) {
		let t = e;
		e = () => t.source;
	} else if (jm(e) || Am(e)) {
		let t = e;
		e = () => t;
	}
	let n = [e, ...t];
	if (n.length > 1 && Mm(n[n.length - 1]) && (n[n.length - 1] = n[n.length - 1].sink), n.length > 2) for (let e = 1; e < n.length - 1; e++) Mm(n[e]) && (n[e] = Nm(n[e]));
	return km(...n);
}
var km = (...e) => {
	let t;
	for (; e.length > 0;) t = e.shift()(t);
	return t;
}, Am = (e) => e?.[Symbol.asyncIterator] != null, jm = (e) => e?.[Symbol.iterator] != null, Mm = (e) => e != null && e.sink != null && e.source != null, Nm = (e) => (t) => {
	let n = e.sink(t);
	if (n?.then != null) {
		let t = _m({ objectMode: !0 });
		n.then(() => {
			t.end();
		}, (e) => {
			t.end(e);
		});
		let r, i = e.source;
		if (Am(i)) r = async function* () {
			yield* i, t.end();
		};
		else if (jm(i)) r = function* () {
			yield* i, t.end();
		};
		else throw Error("Unknown duplex source type - must be Iterable or AsyncIterable");
		return Dm(t, r());
	}
	return e.source;
}, Pm = /* @__PURE__ */ u((/* @__PURE__ */ s(((e, t) => {
	var n = Object.prototype.hasOwnProperty, r = "~";
	function i() {}
	Object.create && (i.prototype = Object.create(null), new i().__proto__ || (r = !1));
	function a(e, t, n) {
		this.fn = e, this.context = t, this.once = n || !1;
	}
	function o(e, t, n, i, o) {
		if (typeof n != "function") throw TypeError("The listener must be a function");
		var s = new a(n, i || e, o), c = r ? r + t : t;
		return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], s] : e._events[c].push(s) : (e._events[c] = s, e._eventsCount++), e;
	}
	function s(e, t) {
		--e._eventsCount === 0 ? e._events = new i() : delete e._events[t];
	}
	function c() {
		this._events = new i(), this._eventsCount = 0;
	}
	c.prototype.eventNames = function() {
		var e = [], t, i;
		if (this._eventsCount === 0) return e;
		for (i in t = this._events) n.call(t, i) && e.push(r ? i.slice(1) : i);
		return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
	}, c.prototype.listeners = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		if (!n) return [];
		if (n.fn) return [n.fn];
		for (var i = 0, a = n.length, o = Array(a); i < a; i++) o[i] = n[i].fn;
		return o;
	}, c.prototype.listenerCount = function(e) {
		var t = r ? r + e : e, n = this._events[t];
		return n ? n.fn ? 1 : n.length : 0;
	}, c.prototype.emit = function(e, t, n, i, a, o) {
		var s = r ? r + e : e;
		if (!this._events[s]) return !1;
		var c = this._events[s], l = arguments.length, u, d;
		if (c.fn) {
			switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
				case 1: return c.fn.call(c.context), !0;
				case 2: return c.fn.call(c.context, t), !0;
				case 3: return c.fn.call(c.context, t, n), !0;
				case 4: return c.fn.call(c.context, t, n, i), !0;
				case 5: return c.fn.call(c.context, t, n, i, a), !0;
				case 6: return c.fn.call(c.context, t, n, i, a, o), !0;
			}
			for (d = 1, u = Array(l - 1); d < l; d++) u[d - 1] = arguments[d];
			c.fn.apply(c.context, u);
		} else {
			var f = c.length, p;
			for (d = 0; d < f; d++) switch (c[d].once && this.removeListener(e, c[d].fn, void 0, !0), l) {
				case 1:
					c[d].fn.call(c[d].context);
					break;
				case 2:
					c[d].fn.call(c[d].context, t);
					break;
				case 3:
					c[d].fn.call(c[d].context, t, n);
					break;
				case 4:
					c[d].fn.call(c[d].context, t, n, i);
					break;
				default:
					if (!u) for (p = 1, u = Array(l - 1); p < l; p++) u[p - 1] = arguments[p];
					c[d].fn.apply(c[d].context, u);
			}
		}
		return !0;
	}, c.prototype.on = function(e, t, n) {
		return o(this, e, t, n, !1);
	}, c.prototype.once = function(e, t, n) {
		return o(this, e, t, n, !0);
	}, c.prototype.removeListener = function(e, t, n, i) {
		var a = r ? r + e : e;
		if (!this._events[a]) return this;
		if (!t) return s(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn !== t || i && !o.once || n && o.context !== n || s(this, a);
		else {
			for (var c = 0, l = [], u = o.length; c < u; c++) (o[c].fn !== t || i && !o[c].once || n && o[c].context !== n) && l.push(o[c]);
			l.length ? this._events[a] = l.length === 1 ? l[0] : l : s(this, a);
		}
		return this;
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new i(), this._eventsCount = 0), this;
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, t !== void 0 && (t.exports = c);
})))(), 1), Fm = class e extends Error {
	name = "TimeoutError";
	constructor(t, n) {
		super(t, n), Error.captureStackTrace?.(this, e);
	}
}, Im = (e) => e.reason ?? new DOMException("This operation was aborted.", "AbortError");
function Lm(e, t) {
	let { milliseconds: n, fallback: r, message: i, customTimers: a = {
		setTimeout,
		clearTimeout
	}, signal: o } = t, s, c, l = new Promise((t, l) => {
		if (typeof n != "number" || Math.sign(n) !== 1) throw TypeError(`Expected \`milliseconds\` to be a positive number, got \`${n}\``);
		if (o?.aborted) {
			l(Im(o)), e.then(t, l);
			return;
		}
		if (o && (c = () => {
			l(Im(o));
		}, o.addEventListener("abort", c, { once: !0 })), e.then(t, l), n === Infinity) return;
		let u = new Fm();
		s = a.setTimeout.call(void 0, () => {
			if (r) try {
				t(r());
			} catch (e) {
				l(e);
			}
			else typeof e.cancel == "function" && e.cancel(), i === !1 ? t() : i instanceof Error ? l(i) : (u.message = i ?? `Promise timed out after ${n} milliseconds`, l(u));
		}, n);
	}).finally(() => {
		l.clear(), c && o && o.removeEventListener("abort", c);
	});
	return l.clear = () => {
		a.clearTimeout.call(void 0, s), s = void 0;
	}, l;
}
// node_modules/.pnpm/p-queue@9.3.5/node_modules/p-queue/dist/lower-bound.js
function Rm(e, t, n) {
	let r = 0, i = e.length;
	for (; i > 0;) {
		let a = Math.trunc(i / 2), o = r + a;
		n(e[o], t) <= 0 ? (r = ++o, i -= a + 1) : i = a;
	}
	return r;
}
// node_modules/.pnpm/p-queue@9.3.5/node_modules/p-queue/dist/priority-queue.js
var zm = 100, Bm = class {
	#e = [];
	#t = 0;
	enqueue(e, t) {
		let { priority: n = 0, id: r } = t ?? {}, { size: i } = this, a = {
			priority: n,
			id: r,
			run: e
		};
		if (i === 0) {
			this.#e.length = 0, this.#t = 0, this.#e.push(a);
			return;
		}
		if (this.#e.at(-1).priority >= n) {
			this.#e.push(a);
			return;
		}
		this.#n();
		let o = Rm(this.#e, a, (e, t) => t.priority - e.priority);
		this.#e.splice(o, 0, a);
	}
	setPriority(e, t) {
		let n = this.#e.findIndex((t, n) => n >= this.#t && t.id === e);
		if (n === -1) throw ReferenceError(`No promise function with the id "${e}" exists in the queue.`);
		let [r] = this.#e.splice(n, 1);
		this.enqueue(r.run, {
			priority: t,
			id: e
		});
	}
	remove(e) {
		let t = this.#e.findIndex((t, n) => n < this.#t ? !1 : typeof e == "string" ? t.id === e : t.run === e);
		t !== -1 && this.#e.splice(t, 1);
	}
	dequeue() {
		if (this.#t === this.#e.length) return;
		let e = this.#e[this.#t];
		return this.#t++, this.#t === this.#e.length ? (this.#e.length = 0, this.#t = 0) : this.#t > zm && this.#t > this.#e.length / 2 && this.#n(), e?.run;
	}
	filter(e) {
		let t = [];
		for (let n = this.#t; n < this.#e.length; n++) {
			let r = this.#e[n];
			r.priority === e.priority && t.push(r.run);
		}
		return t;
	}
	get size() {
		return this.#e.length - this.#t;
	}
	#n() {
		this.#t !== 0 && (this.#e.splice(0, this.#t), this.#t = 0);
	}
}, Vm = class extends Pm.default {
	#e;
	#t;
	#n = 0;
	#r;
	#i = !1;
	#a = !1;
	#o;
	#s = 0;
	#c;
	#l;
	#u;
	#d = [];
	#f = 0;
	#p;
	#m;
	#h = 0;
	#g;
	#_;
	#v = 1n;
	#y = /* @__PURE__ */ new Map();
	#b = /* @__PURE__ */ new Set();
	timeout;
	constructor(e) {
		if (super(), e = {
			carryoverIntervalCount: !1,
			intervalCap: Infinity,
			interval: 0,
			concurrency: Infinity,
			autoStart: !0,
			queueClass: Bm,
			strict: !1,
			...e
		}, !(typeof e.intervalCap == "number" && e.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${e.intervalCap?.toString() ?? ""}\` (${typeof e.intervalCap})`);
		if (e.interval === void 0 || !(Number.isFinite(e.interval) && e.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${e.interval?.toString() ?? ""}\` (${typeof e.interval})`);
		if (e.strict && e.interval === 0) throw TypeError("The `strict` option requires a non-zero `interval`");
		if (e.strict && e.intervalCap === Infinity) throw TypeError("The `strict` option requires a finite `intervalCap`");
		if (this.#e = e.carryoverIntervalCount ?? e.carryoverConcurrencyCount ?? !1, this.#t = e.intervalCap === Infinity || e.interval === 0, this.#r = e.intervalCap, this.#o = e.interval, this.#u = e.strict, this.#p = new e.queueClass(), this.#m = e.queueClass, this.concurrency = e.concurrency, e.timeout !== void 0 && !(Number.isFinite(e.timeout) && e.timeout > 0)) throw TypeError(`Expected \`timeout\` to be a positive finite number, got \`${e.timeout}\` (${typeof e.timeout})`);
		this.timeout = e.timeout, this.#_ = e.autoStart === !1, this.#R();
	}
	#x(e) {
		for (; this.#f < this.#d.length;) {
			let t = this.#d[this.#f];
			if (t !== void 0 && e - t >= this.#o) this.#f++;
			else break;
		}
		(this.#f > 100 && this.#f > this.#d.length / 2 || this.#f === this.#d.length) && (this.#d = this.#d.slice(this.#f), this.#f = 0);
	}
	#S(e) {
		this.#u ? this.#d.push(e) : this.#n++;
	}
	#C() {
		this.#u ? this.#d.length > this.#f && this.#d.pop() : this.#n > 0 && this.#n--;
	}
	#w() {
		return this.#d.length - this.#f;
	}
	get #T() {
		return this.#t ? !0 : this.#u ? this.#w() < this.#r : this.#n < this.#r;
	}
	get #E() {
		return this.#h < this.#g;
	}
	#D() {
		this.#h--, this.#h === 0 && this.emit("pendingZero"), this.#N(), this.emit("next");
	}
	#O() {
		this.#l = void 0, this.#F(), this.#P();
	}
	#k(e) {
		if (this.#u) {
			if (this.#x(e), this.#w() >= this.#r) {
				let t = this.#d[this.#f], n = this.#o - (e - t);
				return this.#A(n), !0;
			}
			return !1;
		}
		if (this.#c === void 0) {
			let t = this.#s - e;
			if (t < 0) this.#n = this.#e ? this.#h : 0;
			else return this.#A(t), !0;
		}
		return !1;
	}
	#A(e) {
		this.#l === void 0 && (this.#l = setTimeout(() => {
			this.#O();
		}, e));
	}
	#j() {
		this.#c &&= (clearInterval(this.#c), void 0);
	}
	#M() {
		this.#l &&= (clearTimeout(this.#l), void 0);
	}
	#N() {
		if (this.#p.size === 0) {
			if (this.#j(), this.emit("empty"), this.#h === 0) {
				if (this.#M(), this.#u && this.#f > 0) {
					let e = Date.now();
					this.#x(e);
				}
				this.emit("idle");
			}
			return !1;
		}
		let e = !1;
		if (!this.#_) {
			let t = Date.now(), n = !this.#k(t);
			if (this.#T && this.#E) {
				let r = this.#p.dequeue();
				this.#t || (this.#S(t), this.#z()), n && this.#P(), r(), this.emit("active"), e = !0;
			}
		}
		return e;
	}
	#P() {
		this.#t || this.#c !== void 0 || this.#u || (this.#c = setInterval(() => {
			this.#F();
		}, this.#o), this.#s = Date.now() + this.#o);
	}
	#F() {
		this.#u || (this.#c !== void 0 && (this.#n === 0 && this.#h === 0 ? this.#j() : this.#s = Date.now() + this.#o), this.#n = this.#e ? this.#h : 0), this.#I(), this.#z();
	}
	#I() {
		for (; this.#N(););
	}
	get concurrency() {
		return this.#g;
	}
	set concurrency(e) {
		if (!(typeof e == "number" && e >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);
		this.#g = e, this.#I();
	}
	setPriority(e, t) {
		if (typeof t != "number" || !Number.isFinite(t)) throw TypeError(`Expected \`priority\` to be a finite number, got \`${t}\` (${typeof t})`);
		this.#p.setPriority(e, t);
	}
	async add(e, t = {}) {
		if (t = {
			timeout: this.timeout,
			...t,
			id: t.id ?? (this.#v++).toString()
		}, t.timeout !== void 0 && !(Number.isFinite(t.timeout) && t.timeout > 0)) throw TypeError(`Expected \`timeout\` to be a positive finite number, got \`${t.timeout}\` (${typeof t.timeout})`);
		return new Promise((n, r) => {
			let i = Symbol(`task-${t.id}`), a = () => void 0, o = async () => {
				a(), this.#h++, this.#y.set(i, {
					id: t.id,
					priority: t.priority ?? 0,
					startTime: Date.now(),
					timeout: t.timeout
				});
				let o;
				try {
					try {
						t.signal?.throwIfAborted();
					} catch (e) {
						throw this.#B(), this.#y.delete(i), e;
					}
					let r = e({ signal: t.signal });
					if (t.timeout !== void 0 && (r = Lm(Promise.resolve(r), {
						milliseconds: t.timeout,
						message: `Task timed out after ${t.timeout}ms (queue has ${this.#h} running, ${this.#p.size} waiting)`
					})), t.signal) {
						let { signal: e } = t;
						r = Promise.race([r, new Promise((t, n) => {
							o = () => {
								n(e.reason);
							}, e.addEventListener("abort", o, { once: !0 }), e.aborted && o();
						})]);
					}
					let a = await r;
					n(a), this.emit("completed", a);
				} catch (e) {
					r(e), this.emit("error", e);
				} finally {
					o && t.signal?.removeEventListener("abort", o), this.#y.delete(i), queueMicrotask(() => {
						this.#D();
					});
				}
			};
			this.#p.enqueue(o, t);
			let s = () => {
				this.#p instanceof Bm ? this.#p.remove(o) : this.#p.remove?.(t.id);
			};
			if (t.signal) {
				let { signal: e } = t, n = () => {
					a(), s(), r(e.reason), this.#N(), this.emit("next");
				};
				if (a = () => {
					e.removeEventListener("abort", n), this.#b.delete(a);
				}, e.aborted) {
					n();
					return;
				}
				e.addEventListener("abort", n, { once: !0 }), this.#b.add(a);
			}
			this.emit("add"), this.#N();
		});
	}
	async addAll(e, t) {
		return Promise.all(e.map(async (e) => this.add(e, t)));
	}
	start() {
		return this.#_ && (this.#_ = !1, this.#I()), this;
	}
	pause() {
		this.#_ = !0;
	}
	clear() {
		for (let e of this.#b) e();
		this.#p = new this.#m(), this.#j(), this.#V(), this.emit("empty"), this.#h === 0 && (this.#M(), this.emit("idle")), this.emit("next");
	}
	async onEmpty() {
		this.#p.size !== 0 && await this.#L("empty");
	}
	async onSizeLessThan(e) {
		this.#p.size < e || await this.#L(["next", "active"], () => this.#p.size < e);
	}
	async onIdle() {
		(this.#h !== 0 || this.#p.size !== 0) && await this.#L("idle");
	}
	async onPendingZero() {
		this.#h !== 0 && await this.#L("pendingZero");
	}
	async onRateLimit() {
		this.isRateLimited || await this.#L("rateLimit");
	}
	async onRateLimitCleared() {
		this.isRateLimited && await this.#L("rateLimitCleared");
	}
	onError() {
		return new Promise((e, t) => {
			let n = (e) => {
				this.off("error", n), t(e);
			};
			this.on("error", n);
		});
	}
	async #L(e, t) {
		let n = Array.isArray(e) ? e : [e];
		return new Promise((e) => {
			let r = () => {
				if (!t || t()) {
					for (let e of n) this.off(e, r);
					e();
				}
			};
			for (let e of n) this.on(e, r);
		});
	}
	get size() {
		return this.#p.size;
	}
	sizeBy(e) {
		return this.#p.filter(e).length;
	}
	get pending() {
		return this.#h;
	}
	get isPaused() {
		return this.#_;
	}
	#R() {
		this.#t || (this.on("add", () => {
			this.#p.size > 0 && this.#z();
		}), this.on("next", () => {
			this.#z();
		}));
	}
	#z() {
		this.#t || this.#a || (this.#a = !0, queueMicrotask(() => {
			this.#a = !1, this.#V();
		}));
	}
	#B() {
		this.#t || (this.#C(), this.#z());
	}
	#V() {
		let e = this.#i;
		if (this.#t || this.#p.size === 0) {
			e && (this.#i = !1, this.emit("rateLimitCleared"));
			return;
		}
		let t;
		if (this.#u) {
			let e = Date.now();
			this.#x(e), t = this.#w();
		} else t = this.#n;
		let n = t >= this.#r;
		n !== e && (this.#i = n, this.emit(n ? "rateLimit" : "rateLimitCleared"));
	}
	get isRateLimited() {
		return this.#i;
	}
	get isSaturated() {
		return this.#h === this.#g && this.#p.size > 0 || this.isRateLimited && this.#p.size > 0;
	}
	get runningTasks() {
		return [...this.#y.values()].map((e) => ({
			...e,
			timeoutRemaining: e.timeout ? Math.max(0, e.startTime + e.timeout - Date.now()) : void 0
		}));
	}
};
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/unixfs-v1/content/file.js
async function Hm(e, t, n, r, i, a, o) {
	if (t instanceof Uint8Array) {
		let e = tm(t, r, i, a);
		n.push(e);
		return;
	}
	if (t.Data == null) throw new R("no data in PBNode");
	let s;
	try {
		s = P.unmarshal(t.Data);
	} catch (e) {
		throw new R(e.message);
	}
	if (s.data != null) {
		let e = s.data, t = tm(e, r, i, a);
		n.push(t), r += BigInt(t.byteLength);
	}
	let c = [];
	if (t.Links.length !== s.blockSizes.length) throw new R("Inconsistent block sizes and dag links");
	for (let e = 0; e < t.Links.length; e++) {
		let n = t.Links[e], o = r, l = o + s.blockSizes[e];
		if ((i >= o && i < l || a >= o && a <= l || i < o && a > l) && c.push({
			link: n,
			blockStart: r
		}), r = l, r > a) break;
	}
	await Om(c, (t) => um(t, (t) => async () => {
		let n = await q(e.get(t.link.Hash, o));
		return {
			...t,
			block: n
		};
	}), (e) => pm(e, {
		ordered: !0,
		concurrency: o.blockReadConcurrency
	}), async (t) => {
		for await (let { link: r, block: s, blockStart: c } of t) {
			let t;
			switch (r.Hash.code) {
				case 112:
					t = k(s);
					break;
				case 85:
					t = s;
					break;
				default:
					n.end(new R(`Unsupported codec: ${r.Hash.code}`));
					return;
			}
			let l = new Vm({ concurrency: 1 });
			l.on("error", (e) => {
				n.end(e);
			}), l.add(async () => {
				o.onProgress?.(new yc("unixfs:exporter:walk:file", { cid: r.Hash })), await Hm(e, t, n, c, i, a, o);
			}), await l.onIdle();
		}
	}), r >= a && n.end();
}
function Um(e, t, n, r, i) {
	async function* a(r = {}) {
		let a = n.fileSize();
		if (a === void 0) throw Error("File was a directory");
		let { start: o, end: s } = nm(a, r.offset, r.length);
		if (s === 0n) return;
		let c = 0n, l = s - o, u = _m();
		r.onProgress?.(new yc("unixfs:exporter:walk:file", { cid: e })), Hm(i, t, u, 0n, o, s, r).catch((e) => {
			u.end(e);
		});
		for await (let e of u) if (e != null) {
			if (c += BigInt(e.byteLength), c > l) throw u.end(), new rd("Read too many bytes - the file size reported by the UnixFS data in the root node may be incorrect");
			c === l && u.end(), r.onProgress?.(new yc("unixfs:exporter:progress:unixfs:file", {
				bytesRead: c,
				totalBytes: l,
				fileSize: a
			})), yield e;
		}
		if (c < l) throw new id("Traversed entire DAG but did not read enough bytes");
	}
	return a;
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/unixfs-v1/content/hamt-sharded-directory.js
async function* Wm(e, t, n, r) {
	let i = e.Links;
	if (e.Data == null) throw new R("no data in PBNode");
	let a;
	try {
		a = P.unmarshal(e.Data);
	} catch (e) {
		throw new R(e.message);
	}
	if (a.fanout == null) throw new R("missing fanout");
	let o = (a.fanout - 1n).toString(16).length, s = Om(i, (i) => um(i, (i) => async () => {
		let a = i.Name == null ? null : i.Name.substring(o);
		return a != null && a !== "" ? { entries: [{
			cid: i.Hash,
			name: a,
			path: `${t}/${a}`
		}] } : (e = k(await q(n.get(i.Hash, r))), r.onProgress?.(new yc("unixfs:exporter:walk:hamt-sharded-directory", { cid: i.Hash })), { entries: Wm(e, t, n, r) });
	}), (e) => pm(e, {
		ordered: !0,
		concurrency: r.blockReadConcurrency
	}));
	for await (let { entries: e } of s) yield* e;
}
function Gm(e, t, n, r, i) {
	function a(n = {}) {
		return n.onProgress?.(new yc("unixfs:exporter:walk:hamt-sharded-directory", { cid: e })), Wm(t, r, i, n);
	}
	return a;
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/unixfs-v1/index.js
var Km = {
	raw: Um,
	file: Um,
	directory: sm,
	"hamt-sharded-directory": Gm,
	metadata: (e, t, n, r) => () => [],
	symlink: (e, t, n, r) => () => []
};
async function qm(e, t, n, r, i) {
	let a = await q(r.get(e, i)), o;
	try {
		o = k(a);
	} catch (e) {
		throw new R(e.message);
	}
	if (o.Data == null) throw new R("no data in PBNode");
	let s;
	try {
		s = P.unmarshal(o.Data);
	} catch (e) {
		throw new R(e.message);
	}
	let c = Km[s.type](e, o, s, n, r);
	if (c == null) throw new td("could not find content exporter");
	return s.isDirectory() ? {
		type: "directory",
		cid: e,
		name: t,
		path: n,
		entries: c,
		unixfs: s,
		node: o
	} : {
		type: "file",
		cid: e,
		name: t,
		path: n,
		content: c,
		unixfs: s,
		node: o,
		size: s.fileSize()
	};
}
// node_modules/.pnpm/ipfs-unixfs-exporter@15.0.4/node_modules/ipfs-unixfs-exporter/dist/src/exporters/index.js
var Jm = {
	112: qm,
	85: om,
	113: $p,
	81: $p,
	297: em,
	[vs.code]: im,
	512: am
};
async function J(e, t, n = {}) {
	let r, i;
	if (e instanceof String || typeof e == "string") {
		let a = await Lu(Qp(e, t, n));
		if (a == null) throw new td(`Could not walk path to ${e}`);
		r = a.cid, i = a.name, e = a.path;
	} else if (N.asCID(e) === e || e instanceof N) r = e, i = e = r.toString();
	else throw new ad("Path must be string or CID");
	let a = Jm[r.code];
	if (a == null) throw new nd(`No resolver for code ${r.code}`);
	return a(r, i, e, t, n);
}
async function* Ym(e, t, n = {}) {
	let r = await J(e, t, n);
	if (r == null) return;
	if (yield {
		cid: r.cid,
		name: r.name,
		path: r.path,
		depth: 0
	}, r.type === "directory") for await (let t of i(r, 0, `${e}`, n)) yield t;
	async function* i(e, n, r, a) {
		n++;
		for await (let o of e.entries(a)) {
			let e = `${r}/${o.name}`;
			yield {
				...o,
				depth: n,
				path: e
			};
			let s = await J(o.cid, t, a);
			s.type === "directory" && (yield* i(s, n, e, a));
		}
	}
}
// node_modules/.pnpm/ms@4.0.0-nightly.202508271359/node_modules/ms/dist/index.js
var Xm = 1e3, Zm = Xm * 60, Qm = Zm * 60, $m = Qm * 24, eh = $m * 7, th = $m * 365.25, nh = th / 12;
function rh(e, t) {
	if (typeof e == "string") return ih(e);
	if (typeof e == "number") return sh(e, t);
	throw Error(`Value provided to ms() must be a string or number. value=${JSON.stringify(e)}`);
}
function ih(e) {
	if (typeof e != "string" || e.length === 0 || e.length > 100) throw Error(`Value provided to ms.parse() must be a string with length between 1 and 99. value=${JSON.stringify(e)}`);
	let t = /^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.exec(e);
	if (!t?.groups) return NaN;
	let { value: n, unit: r = "ms" } = t.groups, i = parseFloat(n), a = r.toLowerCase();
	/* istanbul ignore next - istanbul doesn't understand, but thankfully the TypeScript the exhaustiveness check in the default case keeps us type safe here */
	switch (a) {
		case "years":
		case "year":
		case "yrs":
		case "yr":
		case "y": return i * th;
		case "months":
		case "month":
		case "mo": return i * nh;
		case "weeks":
		case "week":
		case "w": return i * eh;
		case "days":
		case "day":
		case "d": return i * $m;
		case "hours":
		case "hour":
		case "hrs":
		case "hr":
		case "h": return i * Qm;
		case "minutes":
		case "minute":
		case "mins":
		case "min":
		case "m": return i * Zm;
		case "seconds":
		case "second":
		case "secs":
		case "sec":
		case "s": return i * Xm;
		case "milliseconds":
		case "millisecond":
		case "msecs":
		case "msec":
		case "ms": return i;
		default: throw Error(`Unknown unit "${a}" provided to ms.parse(). value=${JSON.stringify(e)}`);
	}
}
function ah(e) {
	let t = Math.abs(e);
	return t >= th ? `${Math.round(e / th)}y` : t >= nh ? `${Math.round(e / nh)}mo` : t >= eh ? `${Math.round(e / eh)}w` : t >= $m ? `${Math.round(e / $m)}d` : t >= Qm ? `${Math.round(e / Qm)}h` : t >= Zm ? `${Math.round(e / Zm)}m` : t >= Xm ? `${Math.round(e / Xm)}s` : `${e}ms`;
}
function oh(e) {
	let t = Math.abs(e);
	return t >= th ? ch(e, t, th, "year") : t >= nh ? ch(e, t, nh, "month") : t >= eh ? ch(e, t, eh, "week") : t >= $m ? ch(e, t, $m, "day") : t >= Qm ? ch(e, t, Qm, "hour") : t >= Zm ? ch(e, t, Zm, "minute") : t >= Xm ? ch(e, t, Xm, "second") : `${e} ms`;
}
function sh(e, t) {
	if (typeof e != "number" || !Number.isFinite(e)) throw Error("Value provided to ms.format() must be of type number.");
	return t?.long ? oh(e) : ah(e);
}
function ch(e, t, n, r) {
	let i = t >= n * 1.5;
	return `${Math.round(e / n)} ${r}${i ? "s" : ""}`;
}
// node_modules/.pnpm/weald@1.1.3/node_modules/weald/dist/src/common.js
function lh(e) {
	n.debug = n, n.default = n, n.coerce = c, n.disable = a, n.enable = i, n.enabled = o, n.humanize = rh, n.destroy = l, Object.keys(e).forEach((t) => {
		n[t] = e[t];
	}), n.names = [], n.skips = [], n.formatters = {};
	function t(e) {
		let t = 0;
		for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t |= 0;
		return n.colors[Math.abs(t) % n.colors.length];
	}
	n.selectColor = t;
	function n(e, t) {
		let i, a = null, o, s;
		function c(...e) {
			if (!c.enabled) return;
			let r = c, a = Number(/* @__PURE__ */ new Date());
			r.diff = a - (i || a), r.prev = i, r.curr = a, i = a, e[0] = n.coerce(e[0]), typeof e[0] != "string" && e.unshift("%O");
			let o = 0;
			e[0] = e[0].replace(/%([a-zA-Z%])/g, (t, i) => {
				if (t === "%%") return "%";
				o++;
				let a = n.formatters[i];
				if (typeof a == "function") {
					let n = e[o];
					t = a.call(r, n), e.splice(o, 1), o--;
				}
				return t;
			}), n.formatArgs.call(r, e), t?.onLog != null && t.onLog(...e), (r.log || n.log).apply(r, e);
		}
		return c.namespace = e, c.useColors = n.useColors(), c.color = n.selectColor(e), c.extend = r, c.destroy = n.destroy, Object.defineProperty(c, "enabled", {
			enumerable: !0,
			configurable: !1,
			get: () => a === null ? (o !== n.namespaces && (o = n.namespaces, s = n.enabled(e)), s) : a,
			set: (e) => {
				a = e;
			}
		}), typeof n.init == "function" && n.init(c), c;
	}
	function r(e, t) {
		let r = n(this.namespace + (t === void 0 ? ":" : t) + e);
		return r.log = this.log, r;
	}
	function i(e) {
		n.save(e), n.namespaces = e, n.names = [], n.skips = [];
		let t, r = (typeof e == "string" ? e : "").split(/[\s,]+/), i = r.length;
		for (t = 0; t < i; t++) r[t] && (e = r[t].replace(/\*/g, ".*?"), e[0] === "-" ? n.skips.push(RegExp("^" + e.substr(1) + "$")) : n.names.push(RegExp("^" + e + "$")));
	}
	function a() {
		let e = [...n.names.map(s), ...n.skips.map(s).map((e) => "-" + e)].join(",");
		return n.enable(""), e;
	}
	function o(e) {
		if (e[e.length - 1] === "*") return !0;
		let t, r;
		for (t = 0, r = n.skips.length; t < r; t++) if (n.skips[t].test(e)) return !1;
		for (t = 0, r = n.names.length; t < r; t++) if (n.names[t].test(e)) return !0;
		return !1;
	}
	function s(e) {
		return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*");
	}
	function c(e) {
		return e instanceof Error ? e.stack ?? e.message : e;
	}
	function l() {
		console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	}
	return n.setupFormatters(n.formatters), n.enable(n.load()), n;
}
// node_modules/.pnpm/weald@1.1.3/node_modules/weald/dist/src/browser.js
var uh = _h(), dh = /* @__PURE__ */ "#0000CC.#0000FF.#0033CC.#0033FF.#0066CC.#0066FF.#0099CC.#0099FF.#00CC00.#00CC33.#00CC66.#00CC99.#00CCCC.#00CCFF.#3300CC.#3300FF.#3333CC.#3333FF.#3366CC.#3366FF.#3399CC.#3399FF.#33CC00.#33CC33.#33CC66.#33CC99.#33CCCC.#33CCFF.#6600CC.#6600FF.#6633CC.#6633FF.#66CC00.#66CC33.#9900CC.#9900FF.#9933CC.#9933FF.#99CC00.#99CC33.#CC0000.#CC0033.#CC0066.#CC0099.#CC00CC.#CC00FF.#CC3300.#CC3333.#CC3366.#CC3399.#CC33CC.#CC33FF.#CC6600.#CC6633.#CC9900.#CC9933.#CCCC00.#CCCC33.#FF0000.#FF0033.#FF0066.#FF0099.#FF00CC.#FF00FF.#FF3300.#FF3333.#FF3366.#FF3399.#FF33CC.#FF33FF.#FF6600.#FF6633.#FF9900.#FF9933.#FFCC00.#FFCC33".split(".");
function fh() {
	return typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? !0 : typeof navigator < "u" && navigator.userAgent?.toLowerCase().match(/(edge|trident)\/(\d+)/) != null ? !1 : typeof document < "u" && document.documentElement?.style?.WebkitAppearance || typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator < "u" && navigator.userAgent?.toLowerCase().match(/firefox\/(\d+)/) != null && parseInt(RegExp.$1, 10) >= 31 || typeof navigator < "u" && navigator.userAgent?.toLowerCase().match(/applewebkit\/(\d+)/);
}
function ph(e) {
	if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + rh(this.diff), !this.useColors) return;
	let t = "color: " + this.color;
	e.splice(1, 0, t, "color: inherit");
	let n = 0, r = 0;
	e[0].replace(/%[a-zA-Z%]/g, (e) => {
		e !== "%%" && (n++, e === "%c" && (r = n));
	}), e.splice(r, 0, t);
}
var mh = console.debug ?? console.log ?? (() => {});
function hh(e) {
	try {
		e ? uh?.setItem("debug", e) : uh?.removeItem("debug");
	} catch {}
}
function gh() {
	let e;
	try {
		e = uh?.getItem("debug");
	} catch {}
	return !e && globalThis.process !== void 0 && "env" in globalThis.process && (e = globalThis.process.env.DEBUG), e;
}
function _h() {
	try {
		return localStorage;
	} catch {}
}
function vh(e) {
	e.j = function(e) {
		try {
			return JSON.stringify(e);
		} catch (e) {
			return "[UnexpectedJSONParseError]: " + e.message;
		}
	};
}
// node_modules/.pnpm/weald@1.1.3/node_modules/weald/dist/src/index.js
var Y = lh({
	formatArgs: ph,
	save: hh,
	load: gh,
	useColors: fh,
	setupFormatters: vh,
	colors: dh,
	storage: uh,
	log: mh
});
Y.formatters.b = (e) => e == null ? "undefined" : Un.baseEncode(e), Y.formatters.t = (e) => e == null ? "undefined" : An.baseEncode(e), Y.formatters.m = (e) => e == null ? "undefined" : Fl.baseEncode(e), Y.formatters.p = (e) => e == null ? "undefined" : e.toString(), Y.formatters.c = (e) => e == null ? "undefined" : e.toString(), Y.formatters.k = (e) => e == null ? "undefined" : e.toString(), Y.formatters.a = (e) => e == null ? "undefined" : e.toString();
function yh(e, t = "") {
	let n = wh(e.message), r = wh(e.stack);
	return n != null && r != null ? r.includes(n) ? `${r.split("\n").join(`\n${t}`)}` : `${n}\n${t}${r.split("\n").join(`\n${t}`)}` : r == null ? n == null ? `${e.toString()}` : `${n}` : `${r.split("\n").join(`\n${t}`)}`;
}
function bh(e) {
	return e instanceof AggregateError || e?.name === "AggregateError" && Array.isArray(e.errors);
}
function xh(e, t = "") {
	if (bh(e)) {
		let n = yh(e, t);
		return e.errors.length > 0 ? (t = `${t}    `, n += `\n${t}${e.errors.map((e) => `${xh(e, `${t}`)}`).join(`\n${t}`)}`) : n += `\n${t}[Error list was empty]`, n.trim();
	}
	return yh(e, t);
}
Y.formatters.e = (e) => e == null ? "undefined" : xh(e);
function Sh(e) {
	let t = () => {};
	return t.enabled = !1, t.color = "", t.diff = 0, t.log = () => {}, t.namespace = e, t.destroy = () => !0, t.extend = () => t, t.useColors = () => !1, t;
}
function Ch(e, t) {
	let n = Sh(`${e}:trace`);
	return Y.enabled(`${e}:trace`) && Y.names.map((e) => e.toString()).find((e) => e.includes(":trace")) != null && (n = Y(`${e}:trace`, t)), Object.assign(Y(e, t), {
		error: Y(`${e}:error`, t),
		trace: n,
		newScope: (n) => Ch(`${e}:${n}`, t)
	});
}
function wh(e) {
	if (e != null && (e = e.trim(), e.length !== 0)) return e;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/consumable-hash.js
function Th(e) {
	function t(t) {
		return t instanceof Eh ? t : new Eh(t, e);
	}
	return t;
}
var Eh = class {
	_value;
	_hashFn;
	_depth;
	_availableBits;
	_currentBufferIndex;
	_buffers;
	constructor(e, t) {
		if (!(e instanceof Uint8Array)) throw Error("can only hash Uint8Arrays");
		this._value = e, this._hashFn = t, this._depth = -1, this._availableBits = 0, this._currentBufferIndex = 0, this._buffers = [];
	}
	async take(e) {
		let t = e;
		for (; this._availableBits < t;) await this._produceMoreBits();
		let n = 0;
		for (; t > 0;) {
			let e = this._buffers[this._currentBufferIndex], r = Math.min(e.availableBits(), t), i = e.take(r);
			n = (n << r) + i, t -= r, this._availableBits -= r, e.availableBits() === 0 && this._currentBufferIndex++;
		}
		return n;
	}
	untake(e) {
		let t = e;
		for (; t > 0;) {
			let e = this._buffers[this._currentBufferIndex], n = Math.min(e.totalBits() - e.availableBits(), t);
			e.untake(n), t -= n, this._availableBits += n, this._currentBufferIndex > 0 && e.totalBits() === e.availableBits() && (this._depth--, this._currentBufferIndex--);
		}
	}
	async _produceMoreBits() {
		this._depth++;
		let e = this._depth > 0 ? gi([this._value, Uint8Array.from([this._depth])]) : this._value, t = new kh(await this._hashFn(e));
		this._buffers.push(t), this._availableBits += t.availableBits();
	}
}, Dh = [
	255,
	254,
	252,
	248,
	240,
	224,
	192,
	128
], Oh = [
	1,
	3,
	7,
	15,
	31,
	63,
	127,
	255
], kh = class {
	_value;
	_currentBytePos;
	_currentBitPos;
	constructor(e) {
		this._value = e, this._currentBytePos = e.length - 1, this._currentBitPos = 7;
	}
	availableBits() {
		return this._currentBitPos + 1 + this._currentBytePos * 8;
	}
	totalBits() {
		return this._value.length * 8;
	}
	take(e) {
		let t = e, n = 0;
		for (; t > 0 && this._haveBits();) {
			let e = this._value[this._currentBytePos], r = this._currentBitPos + 1, i = Math.min(r, t), a = Ah(e, r - i, i);
			n = (n << i) + a, t -= i, this._currentBitPos -= i, this._currentBitPos < 0 && (this._currentBitPos = 7, this._currentBytePos--);
		}
		return n;
	}
	untake(e) {
		for (this._currentBitPos += e; this._currentBitPos > 7;) this._currentBitPos -= 8, this._currentBytePos += 1;
	}
	_haveBits() {
		return this._currentBytePos >= 0;
	}
};
function Ah(e, t, n) {
	return (e & jh(t, n)) >>> t;
}
function jh(e, t) {
	return Dh[e] & Oh[Math.min(t + e - 1, 7)];
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/hamt-constants.js
var Mh = BigInt(hl.code);
async function Nh(e) {
	return (await hl.encode(e)).subarray(0, 8).reverse();
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/persist.js
var Ph = async (e, t, n) => {
	n.codec ??= ea;
	let r = await Ts.digest(e), i = N.create(n.cidVersion ?? 1, n.codec.code, r);
	return await t.put(i, e, {
		...n,
		signal: n.signal
	}), i;
}, Fh = Ch("helia:unixfs:commands:utils:hamt-utils"), Ih = (e, t = 8) => {
	let n = (2 ** t - 1).toString(16).length;
	return e.toString(16).toUpperCase().padStart(n, "0").substring(0, n);
}, Lh = async (e, t, n) => {
	let r = new wu({
		root: !0,
		dir: !0,
		parent: void 0,
		parentKey: void 0,
		path: "",
		dirty: !0,
		flat: !1,
		mtime: n.mtime,
		mode: n.mode
	}, n);
	for (let e = 0; e < t.length; e++) await r.bucket.put(t[e].name, {
		size: t[e].size,
		cid: t[e].cid
	});
	let i = await Lu(r.flush(e));
	if (i == null) throw Error("Flushing shard yielded no result");
	return i;
}, Rh = async (e, t, n) => {
	let r = P.unmarshal(e[0].node.Data ?? /* @__PURE__ */ new Uint8Array()), i = BigInt(2 ** (n.shardFanoutBits ?? 8));
	e.reverse();
	let a, o;
	for (let s = 0; s < e.length; s++) {
		let c = s === e.length - 1, l = e[s], u = new P({
			type: "hamt-sharded-directory",
			data: Uint8Array.from(l.children.bitField().reverse()),
			fanout: i,
			hashType: Mh
		});
		c && (u.mtime = r.mtime, u.mode = r.mode), o = {
			Data: u.marshal(),
			Links: l.node.Links
		};
		let d = O(D(o));
		if (a = await Ph(d, t, n), !c) {
			let t = e[s + 1];
			if (t == null) throw Error("Was not operating on shard root but also had no parent?");
			Fh("updating link in parent sub-shard with prefix %s", t.prefix), t.node.Links = t.node.Links.filter((e) => e.Name !== t.prefix), t.node.Links.push({
				Name: t.prefix,
				Hash: a,
				Tsize: l.node.Links.reduce((e, t) => e + (t.Tsize ?? 0), d.byteLength)
			});
		}
	}
	if (a == null || o == null) throw Error("Noting persisted");
	return {
		cid: a,
		node: o
	};
}, zh = async (e, t, n, r) => {
	let i = Th(Nh)(Hs(t)), a = [], o = r.shardFanoutBits ?? 8;
	for (;;) {
		let s = k(await q(n.get(e, r))), c = new yl.default(), l = Ih(await i.take(o), o);
		a.push({
			prefix: l,
			children: c,
			node: s
		});
		let u;
		for (let e of s.Links) {
			let t = e.Name ?? "";
			if (t.length < l.length) throw Error("Invalid HAMT - link name was too short");
			let n = parseInt(t.substring(0, l.length), 16);
			c.set(n, !0), t.startsWith(l) && (u = e);
		}
		if (u == null) {
			Fh("no link found with prefix %s for %s", l, t);
			break;
		}
		let d = u.Name ?? "";
		if (d.length < l.length) throw Error("Invalid HAMT - link name was too short");
		if (d.length === l.length) e = u.Hash, Fh("descend into sub-shard with prefix %s", d);
		else break;
	}
	return {
		path: a,
		hash: i
	};
}, Bh = class extends Error {
	static name = "InvalidParametersError";
	constructor(e = "Invalid parameters") {
		super(e), this.name = "InvalidParametersError";
	}
};
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/is-over-shard-threshold.js
async function Vh(e, t, n) {
	if (e.Data == null) throw Error("DagPB node had no data");
	let r = n.shardSplitThresholdBytes ?? 262144, i = n.shardSplitStrategy ?? "links-bytes";
	n.profile === "unixfs-v0-2015" && (i = "links-bytes");
	let a = P.unmarshal(e.Data);
	if (!a.isDirectory()) throw Error("Can only estimate the size of directories or shards");
	if (i !== "links-bytes" && i !== "block-bytes") throw new Bh(`Invalid shard split threshold "${i}"`);
	let o = 0;
	return a.type === "directory" ? o = i === "links-bytes" ? Hh(e) : Uh(a, e) : a.type === "hamt-sharded-directory" && (o = i === "links-bytes" ? await Wh(e, 0, r, t, n) : await Gh(e, Jc(a.mode, a.mtime), r, t, n)), o > r;
}
function Hh(e) {
	let t = 0;
	for (let n of e.Links) t += Gc(n.Name ?? ""), t += n.Hash.byteLength;
	return t;
}
function Uh(e, t) {
	let n = Jc(e.mode, e.mtime);
	for (let e of t.Links) n += Kc(Gc(e.Name ?? ""), e.Hash.byteLength, Number(e.Tsize ?? 0));
	return n;
}
async function Wh(e, t, n, r, i) {
	if (t > n) return n;
	if (e.Data == null || !P.unmarshal(e.Data).isDirectory()) return t;
	let a = (2 ** (i.shardFanoutBits ?? 8) - 1).toString(16).length;
	for (let o of e.Links) {
		let e = o.Name ?? "";
		if (e = e.substring(a), t += Gc(e), t += o.Hash.bytes.byteLength, o.Hash.code === 112) {
			let e = k(await q(r.get(o.Hash, i)));
			t += await Wh(e, t, n, r, i);
		}
	}
	return t;
}
async function Gh(e, t, n, r, i) {
	if (t > n) return n;
	if (e.Data == null || !P.unmarshal(e.Data).isDirectory()) return t;
	let a = (2 ** (i.shardFanoutBits ?? 8) - 1).toString(16).length;
	for (let o of e.Links) {
		let e = o.Name ?? "";
		if (e = e.substring(a), t += Kc(Gc(e), o.Hash.byteLength, Number(o.Tsize ?? 0)), o.Hash.code === 112) {
			let e = k(await q(r.get(o.Hash, i)));
			t += await Gh(e, t, n, r, i);
		}
	}
	return t;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/add-link.js
var Kh = Ch("helia:unixfs:components:utils:add-link");
async function qh(e, t, n, r) {
	if (e.node.Data == null) throw new qu("Invalid parent passed to addLink");
	if (P.unmarshal(e.node.Data).type === "hamt-sharded-directory") return Kh("adding link to sharded directory"), Xh(e, t, n, r);
	Kh(`adding ${t.Name} (${t.Hash}) to regular directory`);
	let i = await Yh(e, t, n, r);
	if (await Vh(i.node, n, r)) {
		Kh("converting directory to sharded directory");
		let e = await Jh(i, n, r);
		i.cid = e.cid, i.node = k(await q(n.get(e.cid, r)));
	}
	return i;
}
var Jh = async (e, t, n) => {
	if (e.node.Data == null) throw new qu("Invalid parent passed to convertToShardedDirectory");
	let r = P.unmarshal(e.node.Data), i = await Lh(t, e.node.Links.map((e) => ({
		name: e.Name ?? "",
		size: BigInt(e.Tsize ?? 0),
		cid: e.Hash
	})), {
		...n,
		mode: r.mode,
		mtime: r.mtime,
		cidVersion: e.cid.version
	});
	return Kh(`converted directory to sharded directory ${i.cid}`), i;
}, Yh = async (e, t, n, r) => {
	let i = e.node.Links.filter((e) => {
		let n = e.Name === t.Name;
		if (n && !r.allowOverwriting) throw new Hu();
		return !n;
	});
	if (i.push(t), e.node.Data == null) throw new Bu("Parent node with no data passed to addToDirectory");
	let a = P.unmarshal(e.node.Data), o;
	if (a.mtime != null) {
		let e = Date.now(), t = Math.floor(e / 1e3);
		a.mtime = {
			secs: BigInt(t),
			nsecs: (e - t * 1e3) * 1e3
		}, o = a.marshal();
	} else o = e.node.Data;
	e.node = D({
		Data: o,
		Links: i
	});
	let s = O(e.node), c = await Ts.digest(s);
	r?.signal?.throwIfAborted();
	let l = N.create(e.cid.version, 112, c);
	return await n.put(l, s, r), {
		node: e.node,
		cid: l
	};
}, Xh = async (e, t, n, r) => {
	let { path: i, hash: a } = await zh(e.cid, t.Name, n, r), o = i[i.length - 1];
	if (o == null) throw Error("Invalid HAMT, could not generate path");
	let s = o.prefix, c = parseInt(s, 16);
	Kh("next prefix for %s is %s", t.Name, s);
	let l = `${s}${t.Name}`, u = o.node.Links.find((e) => (e.Name ?? "").startsWith(s)), d = s.length;
	if (u != null) {
		if (Kh("link %s was present in shard", l), u.Name === l) {
			if (!r.allowOverwriting) throw new Hu();
			Kh("overwriting %s in sub-shard", t.Name), o.node.Links = o.node.Links.filter((e) => e.Name !== l), o.node.Links.push({
				Name: l,
				Hash: t.Hash,
				Tsize: t.Tsize
			});
		} else if (u.Name?.length === d) throw Error("Existing link was sub-shard?!");
		else {
			Kh("prefix %s already exists, creating new sub-shard", s);
			let e = o.node.Links.findIndex((e) => e.Name?.startsWith(s)), n = o.node.Links.splice(e, 1)[0], c = (n.Name ?? "").substring(d), l = Th(Nh)(Hs(c)), u = r.shardFanoutBits ?? 8;
			for (let e = 0; e < i.length; e++) await l.take(u), r?.signal?.throwIfAborted();
			for (;;) {
				let e = await l.take(u);
				r?.signal?.throwIfAborted();
				let o = Ih(e, u);
				n.Name = `${o}${c}`;
				let d = await a.take(u);
				r?.signal?.throwIfAborted();
				let f = Ih(d, u);
				if (o === f) {
					let e = new yl.default();
					e.set(d, !0), i.push({
						prefix: f,
						children: e,
						node: { Links: [] }
					});
					continue;
				}
				let p = new yl.default();
				p.set(d, !0), p.set(e, !0), i.push({
					prefix: s,
					children: p,
					node: { Links: [n, {
						Name: `${f}${t.Name}`,
						Hash: t.Hash,
						Tsize: t.Tsize
					}] }
				});
				break;
			}
		}
	} else Kh("link %s was not present in sub-shard", l), t.Name = l, o.node.Links.push(t), o.children.set(c, !0), Kh("adding %s to existing sub-shard", l);
	return Rh(i, n, r);
};
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/cid-to-directory.js
async function Zh(e, t, n = {}) {
	let r = await J(e, t, n);
	if (r.type !== "directory") throw new Ku(`${e.toString()} was not a UnixFS directory`);
	return {
		cid: e,
		node: r.node
	};
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/cid-to-pblink.js
async function Qh(e, t, n, r) {
	let i = await J(e, n, r);
	if (i.type !== "directory" && i.type !== "file" && i.type !== "raw") throw new zu(`${e.toString()} was not a UnixFS node`);
	return {
		Name: t,
		Tsize: i.node instanceof Uint8Array ? i.node.byteLength : $h(i.node),
		Hash: e
	};
}
function $h(e) {
	let t = e.Links.reduce((e, t) => e + (t.Tsize ?? 0), 0);
	return O(e).byteLength + t;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/resolve.js
var eg = Ch("helia:unixfs:components:utils:resolve");
async function tg(e, t, n, r) {
	if (t == null || t === "") return { cid: e };
	let i = await zc(Qp(`/ipfs/${e}${t == null ? "" : `/${t}`}`, n, r));
	if (i.length === 0) throw new Uu("Could not find path in directory");
	return eg("resolved %s to %c", t, e), {
		cid: i[i.length - 1].cid,
		path: t,
		segments: i
	};
}
async function ng(e, t, n, r) {
	if (t.segments == null || t.segments.length === 0) return e;
	let i = t.segments.pop();
	if (i == null) throw Error("Insufficient segments");
	i.cid = e, t.segments.reverse();
	for (let a of t.segments) {
		let [t, o] = await Promise.all([Zh(a.cid, n, r), Qh(i.cid, i.name, n, r)]);
		e = (await qh(t, o, n, {
			...r,
			allowOverwriting: !0,
			cidVersion: e.version
		})).cid, a.cid = e, i = a;
	}
	return e;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/cat.js
async function* rg(e, t, n = {}) {
	let r = await J((await tg(e, n.path, t, n)).cid, t, n);
	if (r.type !== "file" && r.type !== "raw") throw new Gu();
	if (r.content == null) throw new Wu();
	yield* r.content(n);
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/chmod.js
var ig = Ch("helia:unixfs:chmod");
async function ag(e, t, n, r = {}) {
	let i = await tg(e, r.path, n, r);
	if (ig("chmod %c %d", i.cid, t), r.recursive === !0) {
		let a = await Om(async function* () {
			for await (let e of Ym(i.cid, n, r)) {
				let i, a = [], o = await J(e.cid, n, r);
				if (o.type === "raw") i = new P({
					type: "file",
					data: o.node
				});
				else if (o.type === "file" || o.type === "directory") i = o.unixfs, a = o.node.Links;
				else throw new zu();
				i.mode = t;
				let s = {
					Data: i.marshal(),
					Links: a
				};
				yield {
					path: e.path,
					content: s
				};
			}
		}, (t) => Pu(t, n, {
			...r,
			dagBuilder: async function* (t, n) {
				for await (let i of t) yield async function() {
					let t = i.content, a = O(t), o = await Ph(a, n, {
						...r,
						cidVersion: e.version
					});
					if (t.Data == null) throw new Bu(`${o} had no data`);
					let s = P.unmarshal(t.Data);
					return {
						cid: o,
						size: BigInt(a.length),
						path: i.path,
						unixfs: s
					};
				};
			}
		}), async (e) => Lu(e));
		if (a == null) throw new Vu(`Could not chmod ${i.cid.toString()}`);
		return ng(a.cid, i, n, r);
	}
	let a = await q(n.get(i.cid, r)), o, s = [];
	if (i.cid.code === 85) o = new P({
		type: "file",
		data: a
	});
	else {
		let e = k(a);
		if (e.Data == null) throw new Bu(`${i.cid.toString()} had no data`);
		s = e.Links, o = P.unmarshal(e.Data);
	}
	o.mode = t;
	let c = O({
		Data: o.marshal(),
		Links: s
	}), l = await Ts.digest(c), u = N.create(i.cid.version, 112, l);
	return await n.put(u, c), ng(u, i, n, r);
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/cp.js
var og = Ch("helia:unixfs:cp");
async function sg(e, t, n, r, i = {}) {
	if (n.includes("/")) throw new qu("Name must not have slashes");
	let [a, o] = await Promise.all([Zh(t, r, i), Qh(e, n, r, i)]);
	return og("Adding %c as \"%s\" to %c", e, n, t), (await qh(a, o, r, {
		allowOverwriting: i.force,
		cidVersion: t.version,
		...i
	})).cid;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/ls.js
async function* cg(e, t, n = {}) {
	let r = await J((await tg(e, n.path, t, n)).cid, t, n);
	r.type === "directory" ? yield* r.entries(n) : yield r;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/mkdir.js
var lg = Ch("helia:unixfs:mkdir");
async function ug(e, t, n, r = {}) {
	if (t.includes("/")) throw new qu("Path must not have slashes");
	if ((await J(e, n, r)).type !== "directory") throw new Ku(`${e.toString()} was not a UnixFS directory`);
	lg("creating %s", t);
	let i = O({
		Data: new P({
			type: "directory",
			mode: r.mode,
			mtime: r.mtime
		}).marshal(),
		Links: []
	}), a = await Ts.digest(i), o = N.create(r.cidVersion ?? 1, 112, a);
	await n.put(o, i);
	let [s, c] = await Promise.all([Zh(e, n, r), Qh(o, t, n, r)]);
	return lg("adding empty dir called %s to %c", t, e), (await qh(s, c, n, {
		...r,
		allowOverwriting: r.force
	})).cid;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/utils/remove-link.js
var dg = Ch("helia:unixfs:utils:remove-link");
async function fg(e, t, n, r) {
	if (e.node.Data == null) throw new Bu("Parent node had no data");
	if (P.unmarshal(e.node.Data).type === "hamt-sharded-directory") {
		dg(`removing ${t} from sharded directory`);
		let i = await mg(e, t, n, r);
		return await Vh(i.node, n, r) ? i : (dg("converting shard to flat directory %c", e.cid), hg(i, n, r));
	}
	return dg(`removing link ${t} regular directory`), pg(e, t, n, r);
}
var pg = async (e, t, n, r) => {
	e.node.Links = e.node.Links.filter((e) => e.Name !== t);
	let i = await Ph(O(e.node), n, {
		...r,
		cidVersion: e.cid.version
	});
	return dg(`Updated regular directory ${i}`), {
		node: e.node,
		cid: i
	};
}, mg = async (e, t, n, r) => {
	let { path: i } = await zh(e.cid, t, n, r), a = i[i.length - 1];
	if (a == null) throw Error("Invalid HAMT, could not generate path");
	let o = (2 ** (r.shardFanoutBits ?? 8) - 1).toString(16).length, s = a.node.Links.filter((e) => (e.Name ?? "").substring(o) === t).map((e) => e.Name).pop();
	if (s == null) throw Error("File not found");
	let c = s.substring(0, o), l = parseInt(c, 16);
	if (a.node.Links = a.node.Links.filter((e) => e.Name !== s), a.children.unset(l), a.node.Links.length === 1) for (; i.length !== 1;) {
		let e = i[i.length - 1];
		if (e == null || e.node.Links.length > 1) break;
		i.pop();
		let t = i[i.length - 1];
		if (t == null) break;
		let n = e.node.Links[0];
		t.node.Links = t.node.Links.filter((e) => !(e.Name ?? "").startsWith(t.prefix)), t.node.Links.push({
			Hash: n.Hash,
			Name: `${t.prefix}${(n.Name ?? "").substring(o)}`,
			Tsize: n.Tsize
		});
	}
	return Rh(i, n, r);
}, hg = async (e, t, n) => {
	if (e.node.Data == null) throw new qu("Invalid parent passed to convertToFlatDirectory");
	let r = { Links: [] }, i = await J(e.cid, t, n);
	if (i.type !== "directory") throw Error("Unexpected node type");
	for await (let e of i.entries()) {
		let i = 0, a = await J(e.cid, t, n);
		i = a.node instanceof Uint8Array ? a.node.byteLength : O(a.node).length, r.Links.push({
			Hash: e.cid,
			Name: e.name,
			Tsize: i
		});
	}
	let a = P.unmarshal(e.node.Data);
	return r.Data = new P({
		type: "directory",
		mode: a.mode,
		mtime: a.mtime
	}).marshal(), {
		cid: await Ph(O(D(r)), t, {
			codec: ea,
			cidVersion: e.cid.version,
			signal: n.signal
		}),
		node: r
	};
}, gg = Ch("helia:unixfs:rm");
async function _g(e, t, n, r = {}) {
	if (t.includes("/")) throw new qu("Name must not have slashes");
	let i = await Zh(e, n, r);
	return gg("Removing %s from %c", t, e), (await fg(i, t, n, {
		...r,
		cidVersion: e.version
	})).cid;
}
// node_modules/.pnpm/uint8arrays@6.1.1/node_modules/uint8arrays/dist/src/equals.js
function vg(e, t) {
	if (e === t) return !0;
	if (e.byteLength !== t.byteLength) return !1;
	for (let n = 0; n < e.byteLength; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
// node_modules/.pnpm/@sindresorhus+fnv1a@3.1.0/node_modules/@sindresorhus/fnv1a/index.js
var yg = {
	32: 16777619n,
	64: 1099511628211n,
	128: 309485009821345068724781371n,
	256: 374144419156711147060143317175368453031918731002211n,
	512: 35835915874844867368919076489095108449946327955754392558399825615420669938882575126094039892345713852759n,
	1024: 5016456510113118655434598811035278955030765345404790744303017523831112055108147451509157692220295382716162651878526895249385292291816524375083746691371804094271873160484737966720260389217684476157468082573n
}, bg = {
	32: 2166136261n,
	64: 14695981039346656037n,
	128: 144066263297769815596495629667062367629n,
	256: 100029257958052580907070968620625704837092796014241193945225284501741471925557n,
	512: 9659303129496669498009435400716310466090418745672637896108374329434462657994582932197716438449813051892206539805784495328239340083876191928701583869517785n,
	1024: 14197795064947621068722070641403218320880622795441933960878474914617582723252296732303717722150864096521202355549365628174669108571814760471015076148029755969804077320157692458563003215304957150157403644460363550505412711285966361610267868082893823963790439336411086884584107735010676915n
}, xg = new globalThis.TextEncoder();
function Sg(e, t) {
	let n = yg[t], r = bg[t];
	for (let i = 0; i < e.length; i++) r ^= BigInt(e[i]), r = BigInt.asUintN(t, r * n);
	return r;
}
function Cg(e, t, n) {
	if (n.length === 0) throw Error("The `utf8Buffer` option must have a length greater than zero");
	let r = yg[t], i = bg[t], a = e;
	for (; a.length > 0;) {
		let e = xg.encodeInto(a, n);
		a = a.slice(e.read);
		for (let a = 0; a < e.written; a++) i ^= BigInt(n[a]), i = BigInt.asUintN(t, i * r);
	}
	return i;
}
function wg(e, { size: t = 32, utf8Buffer: n } = {}) {
	if (!yg[t]) throw Error("The `size` option must be one of 32, 64, 128, 256, 512, or 1024");
	if (typeof e == "string") {
		if (n) return Cg(e, t, n);
		e = xg.encode(e);
	}
	return Sg(e, t);
}
// node_modules/.pnpm/@libp2p+utils@7.4.5/node_modules/@libp2p/utils/dist/src/filters/hashes.js
var Tg = {
	hash: (e) => Number(wg(e, { size: 32 })),
	hashV: (e, t) => Eg(Tg.hash(e, t))
};
function Eg(e) {
	let t = e.toString(16);
	return t.length % 2 == 1 && (t = `0${t}`), ou(t, "base16");
}
var Dg = class {
	fp;
	h;
	seed;
	constructor(e, t, n, r = 2) {
		if (r > 64) throw TypeError("Invalid Fingerprint Size");
		let i = t.hashV(e, n), a = eu(r);
		for (let e = 0; e < a.length; e++) a[e] = i[e];
		a.length === 0 && (a[0] = 7), this.fp = a, this.h = t, this.seed = n;
	}
	hash() {
		return this.h.hash(this.fp, this.seed);
	}
	equals(e) {
		return e?.fp instanceof Uint8Array && vg(this.fp, e.fp);
	}
};
// node_modules/.pnpm/@libp2p+utils@7.4.5/node_modules/@libp2p/utils/dist/src/filters/utils.js
function Og(e, t) {
	return Math.floor(Math.random() * (t - e)) + e;
}
// node_modules/.pnpm/@libp2p+utils@7.4.5/node_modules/@libp2p/utils/dist/src/filters/bucket.js
var kg = class {
	contents;
	constructor(e) {
		this.contents = Array(e).fill(null);
	}
	has(e) {
		if (!(e instanceof Dg)) throw TypeError("Invalid Fingerprint");
		return this.contents.some((t) => e.equals(t));
	}
	add(e) {
		if (!(e instanceof Dg)) throw TypeError("Invalid Fingerprint");
		for (let t = 0; t < this.contents.length; t++) if (this.contents[t] == null) return this.contents[t] = e, !0;
		return !0;
	}
	swap(e) {
		if (!(e instanceof Dg)) throw TypeError("Invalid Fingerprint");
		let t = Og(0, this.contents.length - 1), n = this.contents[t];
		return this.contents[t] = e, n;
	}
	remove(e) {
		if (!(e instanceof Dg)) throw TypeError("Invalid Fingerprint");
		let t = this.contents.findIndex((t) => e.equals(t));
		return t > -1 && (this.contents[t] = null, !0);
	}
}, Ag = 500, jg = class {
	bucketSize;
	filterSize;
	fingerprintSize;
	buckets;
	count;
	hash;
	seed;
	constructor(e) {
		this.filterSize = e.filterSize, this.bucketSize = e.bucketSize ?? 4, this.fingerprintSize = e.fingerprintSize ?? 2, this.count = 0, this.buckets = [], this.hash = e.hash ?? Tg, this.seed = e.seed ?? Og(0, 1024);
	}
	add(e) {
		typeof e == "string" && (e = ou(e));
		let t = new Dg(e, this.hash, this.seed, this.fingerprintSize), n = this.hash.hash(e, this.seed) % this.filterSize, r = (n ^ t.hash()) % this.filterSize;
		if (this.buckets[n] ?? (this.buckets[n] = new kg(this.bucketSize)), this.buckets[r] ?? (this.buckets[r] = new kg(this.bucketSize)), this.buckets[n].add(t) || this.buckets[r].add(t)) return this.count++, !0;
		let i = [n, r], a = i[Og(0, i.length - 1)];
		this.buckets[a] ?? (this.buckets[a] = new kg(this.bucketSize));
		for (let e = 0; e < Ag; e++) {
			let e = this.buckets[a].swap(t);
			if (e != null && (a = (a ^ e.hash()) % this.filterSize, this.buckets[a] ?? (this.buckets[a] = new kg(this.bucketSize)), this.buckets[a].add(e))) return this.count++, !0;
		}
		return !1;
	}
	has(e) {
		typeof e == "string" && (e = ou(e));
		let t = new Dg(e, this.hash, this.seed, this.fingerprintSize), n = this.hash.hash(e, this.seed) % this.filterSize, r = this.buckets[n]?.has(t) ?? !1;
		if (r) return r;
		let i = (n ^ t.hash()) % this.filterSize;
		return this.buckets[i]?.has(t) ?? !1;
	}
	remove(e) {
		typeof e == "string" && (e = ou(e));
		let t = new Dg(e, this.hash, this.seed, this.fingerprintSize), n = this.hash.hash(e, this.seed) % this.filterSize, r = this.buckets[n]?.remove(t) ?? !1;
		if (r) return this.count--, r;
		let i = (n ^ t.hash()) % this.filterSize, a = this.buckets[i]?.remove(t) ?? !1;
		return a && this.count--, a;
	}
	get reliable() {
		return Math.floor(100 * (this.count / this.filterSize)) <= 90;
	}
}, Mg = class {
	filterSize;
	bucketSize;
	fingerprintSize;
	scale;
	filterSeries;
	hash;
	seed;
	constructor(e) {
		this.bucketSize = e.bucketSize ?? 4, this.filterSize = e.filterSize ?? (1 << 18) / this.bucketSize, this.fingerprintSize = e.fingerprintSize ?? 2, this.scale = e.scale ?? 2, this.hash = e.hash ?? Tg, this.seed = e.seed ?? Og(0, 1024), this.filterSeries = [new jg({
			filterSize: this.filterSize,
			bucketSize: this.bucketSize,
			fingerprintSize: this.fingerprintSize,
			hash: this.hash,
			seed: this.seed
		})];
	}
	add(e) {
		if (typeof e == "string" && (e = ou(e)), this.has(e)) return !0;
		let t = this.filterSeries.find((e) => e.reliable);
		return t ?? (t = new jg({
			filterSize: this.filterSize * this.scale ** +this.filterSeries.length,
			bucketSize: this.bucketSize,
			fingerprintSize: this.fingerprintSize,
			hash: this.hash,
			seed: this.seed
		}), this.filterSeries.push(t)), t.add(e);
	}
	has(e) {
		typeof e == "string" && (e = ou(e));
		for (let t = 0; t < this.filterSeries.length; t++) if (this.filterSeries[t].has(e)) return !0;
		return !1;
	}
	remove(e) {
		typeof e == "string" && (e = ou(e));
		for (let t = 0; t < this.filterSeries.length; t++) if (this.filterSeries[t].remove(e)) return !0;
		return !1;
	}
	get count() {
		return this.filterSeries.reduce((e, t) => e + t.count, 0);
	}
}, Ng = 1877, Pg = 1604, Fg = Ch("helia:unixfs:stat");
async function Ig(e, t, n = {}) {
	let r = await tg(e, n.path, t, n);
	Fg("stat %c", r.cid);
	let i = await J(r.cid, t, n);
	if (i.type === "raw") return n.extended === !0 ? Bg(i) : zg(i);
	if (i.type === "file" || i.type === "directory") return n.extended === !0 ? Rg(i, t, n.filter ?? new Mg({ filterSize: 1024 }), n) : Lg(i);
	throw new zu();
}
function Lg(e) {
	return {
		type: e.type,
		cid: e.cid,
		unixfs: e.unixfs,
		mode: e.unixfs.mode ?? (e.unixfs.isDirectory() ? Ng : Pg),
		mtime: e.unixfs.mtime,
		size: e.unixfs.fileSize()
	};
}
async function Rg(e, t, n, r) {
	let i = await Vg(e.cid, t, !1, n, r);
	return {
		type: e.type,
		cid: e.cid,
		unixfs: e.unixfs,
		size: e.unixfs.isDirectory() ? i.dirSize : e.unixfs.fileSize(),
		mode: e.unixfs.mode ?? (e.unixfs.isDirectory() ? Ng : Pg),
		mtime: e.unixfs.mtime,
		localSize: i.localSize,
		dagSize: i.dagSize,
		deduplicatedDagSize: i.deduplicatedDagSize,
		blocks: i.blocks,
		uniqueBlocks: i.uniqueBlocks
	};
}
function zg(e) {
	return {
		type: e.type,
		cid: e.cid,
		unixfs: void 0,
		mode: Pg,
		mtime: void 0,
		size: BigInt(e.node.byteLength)
	};
}
function Bg(e) {
	return {
		type: e.type,
		cid: e.cid,
		unixfs: void 0,
		mode: Pg,
		mtime: void 0,
		size: BigInt(e.node.byteLength),
		localSize: BigInt(e.node.byteLength),
		dagSize: BigInt(e.node.byteLength),
		deduplicatedDagSize: BigInt(e.node.byteLength),
		blocks: 1n,
		uniqueBlocks: 1n
	};
}
async function Vg(e, t, n, r, i) {
	let a = {
		dirSize: 0n,
		localSize: 0n,
		dagSize: 0n,
		deduplicatedDagSize: 0n,
		blocks: 0n,
		uniqueBlocks: 0n
	};
	try {
		let o = r.has(e.bytes);
		r.add(e.bytes);
		let s = await q(t.get(e, i));
		if (a.blocks++, a.dagSize += BigInt(s.byteLength), o || (a.uniqueBlocks++, a.deduplicatedDagSize += BigInt(s.byteLength)), e.code === 85) a.localSize += BigInt(s.byteLength), n && (a.dirSize += BigInt(s.byteLength));
		else if (e.code === 112) {
			let o = k(s), c;
			if (o.Data != null && (c = P.unmarshal(o.Data)), o.Links.length > 0) {
				for (let e of o.Links) {
					let n = await Vg(e.Hash, t, Hg(e, c), r, i);
					a.localSize += n.localSize, a.dagSize += n.dagSize, a.deduplicatedDagSize += n.deduplicatedDagSize, a.blocks += n.blocks, a.uniqueBlocks += n.uniqueBlocks, a.dirSize += n.dirSize;
				}
				n && c != null && (a.dirSize += c.fileSize());
			} else {
				if (c == null) throw new Bu(`PBNode ${e.toString()} had no data`);
				c.data != null && (a.localSize += BigInt(c.data.byteLength ?? 0)), n && (a.dirSize += c.fileSize());
			}
		} else throw new Vu(`${e.toString()} was neither DAG_PB nor RAW`);
	} catch (e) {
		if (e.name !== "NotFoundError" && e.name !== "BlockNotFoundWhileOfflineError" || i.offline !== !0) throw e;
	}
	return a;
}
function Hg(e, t) {
	if (t == null) return !1;
	let n = e.Name;
	return n == null ? !1 : t.type === "directory" || t.type === "hamt-sharded-directory" && n.length > 2;
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/commands/touch.js
var Ug = Ch("helia:unixfs:touch");
async function Wg(e, t, n = {}) {
	let r = await tg(e, n.path, t, n), i = n.mtime ?? {
		secs: BigInt(Math.round(Date.now() / 1e3)),
		nsecs: 0
	};
	if (Ug("touch %c %o", r.cid, i), n.recursive) {
		let a = await Om(async function* () {
			for await (let e of Ym(r.cid, t)) {
				let r, a, o = await J(e.cid, t, n);
				if (o.type === "raw") r = new P({ data: o.node }), a = [];
				else if (o.type === "file" || o.type === "directory") r = o.unixfs, a = o.node.Links;
				else throw new zu();
				r.mtime = i;
				let s = {
					Data: r.marshal(),
					Links: a
				};
				yield {
					path: e.path,
					content: s
				};
			}
		}, (r) => Pu(r, t, {
			...n,
			dagBuilder: async function* (t, r) {
				for await (let i of t) yield async function() {
					let t = i.content, a = O(t), o = await Ph(a, r, {
						...n,
						cidVersion: e.version
					});
					if (t.Data == null) throw new Bu(`${o} had no data`);
					let s = P.unmarshal(t.Data);
					return {
						cid: o,
						size: BigInt(a.length),
						path: i.path,
						unixfs: s
					};
				};
			}
		}), async (e) => Lu(e));
		if (a == null) throw new Vu(`Could not chmod ${r.cid.toString()}`);
		return ng(a.cid, r, t, n);
	}
	let a = await q(t.get(r.cid, n)), o, s = [];
	if (r.cid.code === 85) o = new P({ data: a });
	else {
		let e = k(a);
		if (s = e.Links, e.Data == null) throw new Bu(`${r.cid.toString()} had no data`);
		o = P.unmarshal(e.Data);
	}
	o.mtime = i;
	let c = O({
		Data: o.marshal(),
		Links: s
	}), l = await Ts.digest(c), u = N.create(r.cid.version, 112, l);
	return await t.put(u, c), ng(u, r, t, n);
}
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/unixfs.js
var Gg = class {
	components;
	constructor(e) {
		this.components = e;
	}
	async *addAll(e, t = {}) {
		yield* Yu(e, this.components.blockstore, t);
	}
	async addBytes(e, t = {}) {
		return Xu(e, this.components.blockstore, t);
	}
	async addByteStream(e, t = {}) {
		return Zu(e, this.components.blockstore, t);
	}
	async addFile(e, t = {}) {
		return Qu(e, this.components.blockstore, t);
	}
	async addDirectory(e = {}, t = {}) {
		return $u(e, this.components.blockstore, t);
	}
	async *cat(e, t = {}) {
		yield* rg(e, this.components.blockstore, t);
	}
	async chmod(e, t, n = {}) {
		return ag(e, t, this.components.blockstore, n);
	}
	async cp(e, t, n, r = {}) {
		return sg(e, t, n, this.components.blockstore, r);
	}
	async *ls(e, t = {}) {
		yield* cg(e, this.components.blockstore, t);
	}
	async mkdir(e, t, n = {}) {
		return ug(e, t, this.components.blockstore, n);
	}
	async rm(e, t, n = {}) {
		return _g(e, t, this.components.blockstore, n);
	}
	async stat(e, t = {}) {
		return Ig(e, this.components.blockstore, t);
	}
	async touch(e, t = {}) {
		return Wg(e, this.components.blockstore, t);
	}
};
// node_modules/.pnpm/@helia+unixfs@7.2.1/node_modules/@helia/unixfs/dist/src/index.js
function Kg(e) {
	return new Gg(e);
}
// src/read-car.ts
async function qg(e) {
	let t = await oi.fromBytes(e), [n] = await t.getRoots();
	if (!n) throw Error("CAR has no roots");
	let r = /* @__PURE__ */ new Map();
	for await (let e of t.blocks()) r.set(e.cid.toString(), e.bytes);
	let i = Kg({ blockstore: {
		async *get(e) {
			let t = r.get(e.toString());
			if (!t) throw Error(`Missing block ${e}`);
			yield t;
		},
		async *getBlocks(e) {
			for await (let t of e) {
				let e = r.get(t.toString());
				e && (yield e);
			}
		},
		async put(e, t) {
			return r.set(e.toString(), t), e;
		},
		async has(e) {
			return r.has(e.toString());
		}
	} }), a = async (e) => {
		let t = [];
		for await (let n of i.cat(e)) t.push(n);
		let n = new Uint8Array(t.reduce((e, t) => e + t.length, 0)), r = 0;
		for (let e of t) n.set(e, r), r += e.length;
		return new TextDecoder().decode(n);
	}, o = [], s = null;
	for await (let e of i.ls(n.toString())) e.name === "events.ndjson" && (o = (await a(e.path)).split("\n").filter(Boolean).map((e) => JSON.parse(e))), e.name === "manifest.json" && (s = JSON.parse(await a(e.path)));
	if (o.length === 0) throw Error("Seal has no events.ndjson");
	return {
		events: o,
		manifest: s
	};
}
// node_modules/.pnpm/@noble+hashes@2.4.0/node_modules/@noble/hashes/_u64.js
var Jg = (e) => e / 2 ** 32 | 0, Yg = (e) => e >>> 0;
function Xg(e, t, n, r) {
	let i = Jg(n), a = Yg(n);
	e.setUint32(t, r ? a : i, r), e.setUint32(t + 4, r ? i : a, r);
}
// node_modules/.pnpm/@noble+hashes@2.4.0/node_modules/@noble/hashes/utils.js
function Zg(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in e && e.BYTES_PER_ELEMENT === 1;
}
var Qg = (e) => e ? `"${e}" ` : "";
function $g(e, t = "") {
	if (typeof e != "number") throw TypeError(Qg(t) + "expected number, got " + typeof e);
	if (!Number.isSafeInteger(e) || e < 0) throw RangeError(Qg(t) + "expected integer >= 0, got " + e);
	return e;
}
function e_(e, t, n = "") {
	if (Zg(e) && (t === void 0 || e.length === t)) return e;
	t !== void 0 && $g(t, "length");
	let r = Zg(e), i = t === void 0 ? "" : ` of length ${t}`, a = r ? `length=${e.length}` : `type=${typeof e}`, o = Qg(n) + "expected Uint8Array" + i + ", got " + a;
	throw r ? RangeError(o) : TypeError(o);
}
var t_ = (e, t) => {
	if (typeof e != "object" || !e || Array.isArray(e)) throw TypeError((t === "object" ? "" : `"${t}" `) + "expected object, got type=" + typeof e);
}, n_ = (e, t) => {
	t_(e, t);
	let n = Object.getPrototypeOf(e);
	if (n !== Object.prototype && n !== null) throw TypeError(`"${t}" expected plain object`);
	if (Object.hasOwn(e, "__proto__")) throw TypeError(`"${t}.__proto__" is not allowed`);
};
function r_(e, t = !0) {
	if (e.destroyed) throw Error("hash was destroyed");
	if (t && e.finished) throw Error("digest() was already called");
}
function i_(e, t) {
	e_(e, void 0, "output");
	let n = t.outputLen;
	if (!(e.length >= n)) throw RangeError("\"output\" expected length >= " + n);
}
function a_(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function o_(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function s_(e, t) {
	return e << 32 - t | e >>> t;
}
var c_ = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", l_ = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function u_(e) {
	if (e_(e), c_) return e.toHex();
	let t = "";
	for (let n = 0; n < e.length; n++) t += l_[e[n]];
	return t;
}
function d_(e) {
	return e >= 48 && e <= 57 ? e - 48 : e >= 65 && e <= 70 ? e - 55 : e >= 97 && e <= 102 ? e - 87 : void 0;
}
function f_(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	if (c_) try {
		return Uint8Array.fromHex(e);
	} catch (e) {
		throw e instanceof SyntaxError ? RangeError(e.message) : e;
	}
	let t = e.length, n = t / 2;
	if (t % 2) throw RangeError("hex string expected, got unpadded hex of length " + t);
	let r = new Uint8Array(n);
	for (let t = 0, i = 0; t < n; t++, i += 2) {
		let n = d_(e.charCodeAt(i)), a = d_(e.charCodeAt(i + 1));
		if (n === void 0 || a === void 0) {
			let t = e[i] + e[i + 1];
			throw RangeError("hex string expected, got non-hex character \"" + t + "\" at index " + i);
		}
		r[t] = n * 16 + a;
	}
	return r;
}
function p_(...e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		e_(r), t += r.length;
	}
	let n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t++) {
		let i = e[t];
		n.set(i, r), r += i.length;
	}
	return n;
}
function m_(e, t, n = "opts") {
	return n_(e, "defaults"), t !== void 0 && n_(t, n), Object.assign(Object.create(null), e, t);
}
function h_(e, t = {}) {
	if (typeof e != "function") throw TypeError("\"hashCons\" expected function, got type=" + typeof e);
	t = m_({}, t, "info");
	let n = (t, n) => e(n).update(t).digest(), r = e(void 0);
	return n.outputLen = r.outputLen, n.blockLen = r.blockLen, n.canXOF = r.canXOF, n.create = (t) => e(t), Object.assign(n, t), Object.freeze(n);
}
function g_(e = 32) {
	$g(e, "bytesLength");
	let t = typeof globalThis == "object" ? globalThis.crypto : null;
	if (typeof t?.getRandomValues != "function") throw Error("crypto.getRandomValues must be defined");
	if (e > 65536) throw RangeError(`"bytesLength" expected <= 65536, got ${e}`);
	return t.getRandomValues(new Uint8Array(e));
}
var __ = (e) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	e
]) });
// node_modules/.pnpm/@noble+hashes@2.4.0/node_modules/@noble/hashes/_md.js
function v_(e, t, n) {
	return e & t ^ ~e & n;
}
function y_(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var b_ = class {
	blockLen;
	outputLen;
	canXOF = !1;
	padOffset;
	isLE;
	buffer;
	view;
	finished = !1;
	length = 0;
	pos = 0;
	destroyed = !1;
	constructor(e, t, n, r) {
		this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = o_(this.buffer);
	}
	update(e) {
		r_(this), e_(e);
		let { view: t, buffer: n, blockLen: r } = this, i = e.length, a = !1;
		for (let o = 0; o < i;) {
			let s = Math.min(r - this.pos, i - o);
			if (s === r) {
				let t = o_(e);
				for (; r <= i - o; o += r) this.process(t, o);
				a = !0;
			} else n.set(o === 0 && s === i ? e : e.subarray(o, o + s), this.pos), this.pos += s, o += s, this.pos === r && (this.process(t, 0), this.pos = 0, a = !0);
		}
		return this.length += e.length, a && this.roundClean(), this;
	}
	digestInto(e) {
		r_(this), i_(e, this), this.finished = !0;
		let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
		t[a++] = 128, t.fill(0, a), this.padOffset > r - a && (this.process(n, 0), t.fill(0)), Xg(n, r - 8, this.length * 8, i), this.process(n, 0), this.roundClean();
		let o = e === t ? n : o_(e), s = this.outputLen, c = s / 4, l = this.get();
		if (s % 4 || c > l.length) throw Error("invalid outputLen");
		for (let e = 0; e < c; e++) o.setUint32(4 * e, l[e], i);
	}
	digest() {
		let { buffer: e, outputLen: t } = this;
		this.digestInto(e);
		let n = e.slice(0, t);
		return this.destroy(), n;
	}
	_cloneIntoMeta(e) {
		let { buffer: t, length: n, finished: r, destroyed: i, pos: a } = this;
		return e.destroyed = i, e.finished = r, e.length = n, e.pos = a, a && e.buffer.set(t), e;
	}
	clone() {
		return this._cloneInto();
	}
}, x_ = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), S_ = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), C_ = /* @__PURE__ */ new Uint32Array(64), w_ = class extends b_ {
	A = 0;
	B = 0;
	C = 0;
	D = 0;
	E = 0;
	F = 0;
	G = 0;
	H = 0;
	constructor(e, t) {
		super(64, e, 8, !1), this.A = t[0] | 0, this.B = t[1] | 0, this.C = t[2] | 0, this.D = t[3] | 0, this.E = t[4] | 0, this.F = t[5] | 0, this.G = t[6] | 0, this.H = t[7] | 0;
	}
	get() {
		let { A: e, B: t, C: n, D: r, E: i, F: a, G: o, H: s } = this;
		return [
			e,
			t,
			n,
			r,
			i,
			a,
			o,
			s
		];
	}
	set(e, t, n, r, i, a, o, s) {
		this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = s | 0;
	}
	_cloneInto(e) {
		return (e ||= new this.constructor()).set(...this.get()), this._cloneIntoMeta(e);
	}
	process(e, t) {
		for (let n = 0; n < 16; n++, t += 4) C_[n] = e.getUint32(t, !1);
		for (let e = 16; e < 64; e++) {
			let t = C_[e - 15], n = C_[e - 2], r = s_(t, 7) ^ s_(t, 18) ^ t >>> 3, i = s_(n, 17) ^ s_(n, 19) ^ n >>> 10;
			C_[e] = i + C_[e - 7] + r + C_[e - 16] | 0;
		}
		let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
		for (let e = 0; e < 64; e++) {
			let t = s_(o, 6) ^ s_(o, 11) ^ s_(o, 25), u = l + t + v_(o, s, c) + S_[e] + C_[e] | 0, d = (s_(n, 2) ^ s_(n, 13) ^ s_(n, 22)) + y_(n, r, i) | 0;
			l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
		}
		n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
	}
	roundClean() {
		a_(C_);
	}
	destroy() {
		this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), a_(this.buffer);
	}
}, T_ = class extends w_ {
	constructor() {
		super(32, x_);
	}
}, E_ = /* @__PURE__ */ h_(() => new T_(), /* @__PURE__ */ __(1));
// node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/utils.js
function D_(e, t, n = () => {}) {
	if (!Array.isArray(e)) throw TypeError(`"${t}" expected array, got type=${typeof e}`);
	for (let r = 0; r < e.length; r++) n(e[r], `${t}[${r}]`);
	return e;
}
var X = (e, t, n) => e_(e, t, n), O_ = $g;
function k_(e, t = "object") {
	if (typeof e != "object" || !e || Array.isArray(e)) throw TypeError(t === "object" ? "expected valid options object" : `"${t}" expected object, got type=${typeof e}`);
	return e;
}
function A_(e, t) {
	if (typeof e != "function") throw TypeError(`"${t}" is invalid: expected function, got ${typeof e}`);
	return e;
}
var j_ = u_, M_ = (...e) => p_(...e), N_ = (e) => f_(e), P_ = Zg, F_ = (e) => g_(e), I_ = /* @__PURE__ */ BigInt(0), L_ = /* @__PURE__ */ BigInt(1), R_ = (e) => e ? `"${e}" ` : "";
function z_(e, t = "") {
	if (typeof e != "boolean") throw TypeError(R_(t) + "expected boolean, got type=" + typeof e);
	return e;
}
function B_(e) {
	if (typeof e == "bigint") {
		if (!Y_(e)) throw RangeError("positive bigint expected, got " + e);
	} else O_(e);
	return e;
}
function V_(e, t = "") {
	if (typeof e != "number") {
		let n = t && `"${t}" `;
		throw TypeError(n + "expected number, got type=" + typeof e);
	}
	if (!Number.isSafeInteger(e)) {
		let n = t && `"${t}" `;
		throw RangeError(n + "expected safe integer, got " + e);
	}
}
function H_(e) {
	if (typeof e != "string") throw TypeError("hex string expected, got " + typeof e);
	return e === "" ? I_ : BigInt("0x" + e);
}
function U_(e) {
	return H_(u_(e));
}
function W_(e) {
	return H_(u_(q_(e_(e)).reverse()));
}
function G_(e, t) {
	if ($g(t), t === 0) throw Error("zero output length is invalid");
	e = B_(e);
	let n = t * 2, r = e.toString(16);
	if (r.length > n) throw RangeError("number is too large");
	return f_(r.padStart(n, "0"));
}
function K_(e, t) {
	return G_(e, t).reverse();
}
function q_(e) {
	return Uint8Array.from(X(e));
}
function J_(e) {
	if (typeof e != "string") throw TypeError("ascii string expected, got " + typeof e);
	return Uint8Array.from(e, (t, n) => {
		let r = t.charCodeAt(0);
		if (t.length !== 1 || r > 127) throw RangeError(`string contains non-ASCII character "${e[n]}" with code ${r} at position ${n}`);
		return r;
	});
}
function Y_(e) {
	return typeof e == "bigint" && I_ <= e;
}
function X_(e, t, n) {
	return Y_(e) && Y_(t) && Y_(n) && t <= e && e < n;
}
function Z_(e, t, n, r) {
	if (!X_(t, n, r)) throw RangeError("expected valid " + e + ": " + n + " <= n < " + r + ", got " + t);
}
function Q_(e) {
	if (e < I_) throw Error("expected non-negative bigint, got " + e);
	return e === I_ ? 0 : e.toString(2).length;
}
var $_ = (e) => (V_(e, "n"), (L_ << BigInt(e)) - L_);
function ev(e, t = {}, n = {}, r = "object") {
	k_(e, r), k_(t, "fields"), k_(n, "optFields");
	function i(t, n, i) {
		let a = r === "object" ? `param "${String(t)}"` : `"${r}.${String(t)}"`, o = e[t];
		if (!Object.hasOwn(e, t) && (i ? o !== void 0 : n !== "function")) throw TypeError(`${a} is invalid: expected own property`);
		if (i && o === void 0) return;
		let s = typeof o;
		if (s !== n || o === null) throw TypeError(`${a} is invalid: expected ${n}, got ${s}`);
	}
	let a = (e, t) => Object.entries(e).forEach(([e, n]) => i(e, n, t));
	a(t, !1), a(n, !0);
}
// node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/modular.js
var Z = /* @__PURE__ */ BigInt(0), Q = /* @__PURE__ */ BigInt(1), tv = /* @__PURE__ */ BigInt(2), nv = /* @__PURE__ */ BigInt(3), rv = /* @__PURE__ */ BigInt(4), iv = /* @__PURE__ */ BigInt(5), av = /* @__PURE__ */ BigInt(7), ov = /* @__PURE__ */ BigInt(8), sv = /* @__PURE__ */ BigInt(9), cv = /* @__PURE__ */ BigInt(15), lv = /* @__PURE__ */ BigInt(16), uv = /* @__PURE__ */ BigInt("0x10000000000000000");
function dv(e, t) {
	if (t <= Z) throw Error("mod: expected positive modulus, got " + t);
	let n = e % t;
	return n >= Z ? n : t + n;
}
function fv(e, t, n) {
	if (n <= Q) throw Error("pow: expected modulus > 1, got " + n);
	if (typeof t != "bigint") throw TypeError("invalid exponent: expected bigint, got " + typeof t);
	if (t < Z) throw Error("invalid exponent, negatives unsupported");
	if (t === Z) return Q;
	if (t === Q) return e;
	let r = e % n;
	if (r < Z && (r += n), t < uv) {
		let e = Q;
		for (; t > Z;) t & Q && (e = e * r % n), r = r * r % n, t >>= Q;
		return e;
	}
	let i = [];
	for (; t > Z;) i.push(Number(t & cv)), t >>= rv;
	let a = Array(16);
	a[0] = Q, a[1] = r;
	for (let e = 2; e < 16; e++) a[e] = a[e - 1] * r % n;
	let o = a[i[i.length - 1]];
	for (let e = i.length - 2; e >= 0; e--) {
		o = o * o % n, o = o * o % n, o = o * o % n, o = o * o % n;
		let t = i[e];
		t !== 0 && (o = o * a[t] % n);
	}
	return o;
}
function $(e, t, n) {
	if (n <= Q) throw Error("pow2: expected modulus > 1, got " + n);
	if (t < Z) throw Error("pow2: expected non-negative exponent, got " + t);
	let r = e;
	for (; t-- > Z;) r *= r, r %= n;
	return r;
}
function pv(e, t) {
	if (e === Z) throw Error("invert: expected non-zero number");
	if (t <= Q) throw Error("invert: expected modulus > 1, got " + t);
	let n = dv(e, t), r = t, i = Z, a = Q;
	for (; n !== Z;) {
		let e = r / n, t = r - n * e, o = i - a * e;
		r = n, n = t, i = a, a = o;
	}
	if (r !== Q) throw Error("invert: does not exist");
	return dv(i, t);
}
function mv(e, t, n) {
	let r = e;
	if (!r.eql(r.sqr(t), n)) throw Error("Cannot find square root");
}
function hv(e, t) {
	if ((e & Q) === Z) throw Error(t + ": expected odd modulus, got " + e);
}
function gv(e, t) {
	let n = e, r = (n.ORDER + Q) / rv, i = n.pow(t, r);
	return mv(n, i, t), i;
}
function _v(e, t) {
	let n = e, r = (n.ORDER - iv) / ov, i = n.mul(t, tv), a = n.pow(i, r), o = n.mul(t, a), s = n.mul(n.mul(o, tv), a), c = n.mul(o, n.sub(s, n.ONE));
	return mv(n, c, t), c;
}
function vv(e) {
	let t = Ov(e), n = yv(e), r = n(t, t.neg(t.ONE)), i = n(t, r), a = n(t, t.neg(r)), o = (e + av) / lv;
	return ((e, t) => {
		let n = e, s = n.pow(t, o), c = n.mul(s, r), l = n.mul(s, i), u = n.mul(s, a), d = n.eql(n.sqr(c), t), f = n.eql(n.sqr(l), t);
		s = n.cmov(s, c, d), c = n.cmov(u, l, f);
		let p = n.eql(n.sqr(c), t), m = n.cmov(s, c, p);
		return mv(n, m, t), m;
	});
}
function yv(e) {
	if (e < nv) throw Error("sqrt is not defined for small field");
	hv(e, "tonelliShanks");
	let t = e - Q, n = 0;
	for (; t % tv === Z;) t /= tv, n++;
	let r = tv, i = Ov(e);
	for (; wv(i, r) === 1;) if (r++ > 1e3) throw Error("Cannot find square root: probably non-prime P");
	if (n === 1) return gv;
	let a = i.pow(r, t), o = (t + Q) / tv;
	return function(e, r) {
		let i = e;
		if (i.is0(r)) return r;
		if (wv(i, r) !== 1) throw Error("Cannot find square root");
		let s = n, c = i.mul(i.ONE, a), l = i.pow(r, t), u = i.pow(r, o);
		for (; !i.eql(l, i.ONE);) {
			if (i.is0(l)) throw Error("Cannot find square root: probably non-prime P");
			let e = 1, t = i.sqr(l);
			for (; !i.eql(t, i.ONE);) if (e++, t = i.sqr(t), e === s) throw Error("Cannot find square root");
			let n = Q << BigInt(s - e - 1), r = i.pow(c, n);
			s = e, c = i.sqr(r), l = i.mul(l, c), u = i.mul(u, r);
		}
		return u;
	};
}
function bv(e) {
	return hv(e, "Fp.sqrt"), e % rv === nv ? gv : e % ov === iv ? _v : e % lv === sv ? vv(e) : yv(e);
}
var xv = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function Sv(e) {
	if (k_(e, "field"), typeof e.ORDER != "bigint") throw TypeError("param \"ORDER\" is invalid: expected bigint, got " + typeof e.ORDER);
	V_(e.BYTES, "BYTES"), V_(e.BITS, "BITS");
	for (let t of xv) A_(e[t], "field." + t);
	if (e.BYTES < 1 || e.BITS < 1) throw Error("invalid field: expected BYTES/BITS > 0");
	if (e.ORDER <= Q) throw Error("invalid field: expected ORDER > 1, got " + e.ORDER);
	return e;
}
function Cv(e, t, n = !1) {
	Sv(e), D_(t, "nums"), z_(n, "passZero");
	let r = e, i = Array(t.length).fill(n ? r.ZERO : void 0), a = t.reduce((e, t, n) => r.is0(t) ? e : (i[n] = e, r.mul(e, t)), r.ONE), o = r.inv(a);
	return t.reduceRight((e, t, n) => r.is0(t) ? e : (i[n] = r.mul(e, i[n]), r.mul(e, t)), o), i;
}
function wv(e, t) {
	Sv(e);
	let n = e;
	hv(n.ORDER, "FpLegendre");
	let r = (n.ORDER - Q) / tv, i = n.pow(t, r), a = n.eql(i, n.ONE), o = n.eql(i, n.ZERO), s = n.eql(i, n.neg(n.ONE));
	if (!a && !o && !s) throw Error("invalid Legendre symbol result");
	return a ? 1 : o ? 0 : -1;
}
function Tv(e, t) {
	if (t !== void 0 && O_(t), e <= Z) throw Error("invalid n length: expected positive n, got " + e);
	if (t !== void 0 && t < 1) throw Error("invalid n length: expected positive bit length, got " + t);
	let n = Q_(e);
	if (t !== void 0 && t < n) throw Error(`invalid n length: expected nBitLength (${t}) >= bitLen(n) (${n})`);
	let r = t === void 0 ? n : t;
	return {
		nBitLength: r,
		nByteLength: Math.ceil(r / 8)
	};
}
var Ev = /* @__PURE__ */ new WeakMap(), Dv = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = Z;
	ONE = Q;
	_lengths;
	_mod;
	constructor(e, t = {}) {
		if (e <= Q) throw Error("invalid field: expected ORDER > 1, got " + e);
		let n;
		this.isLE = !1, typeof t == "object" && t && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", {
			value: t.sqrt,
			enumerable: !0
		}), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
		let { nBitLength: r, nByteLength: i } = Tv(e, n);
		if (i > 2048) throw Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = e, this.BITS = r, this.BYTES = i, Object.freeze(this);
	}
	create(e) {
		return dv(e, this.ORDER);
	}
	isValid(e) {
		if (typeof e != "bigint") throw TypeError("invalid field element: expected bigint, got " + typeof e);
		return Z <= e && e < this.ORDER;
	}
	is0(e) {
		return e === Z;
	}
	isValidNot0(e) {
		return !this.is0(e) && this.isValid(e);
	}
	isOdd(e) {
		return (e & Q) === Q;
	}
	neg(e) {
		return dv(-e, this.ORDER);
	}
	eql(e, t) {
		return e === t;
	}
	sqr(e) {
		return dv(e * e, this.ORDER);
	}
	add(e, t) {
		return dv(e + t, this.ORDER);
	}
	sub(e, t) {
		return dv(e - t, this.ORDER);
	}
	mul(e, t) {
		return dv(e * t, this.ORDER);
	}
	pow(e, t) {
		return fv(e, t, this.ORDER);
	}
	div(e, t) {
		return dv(e * pv(t, this.ORDER), this.ORDER);
	}
	sqrN(e) {
		return e * e;
	}
	addN(e, t) {
		return e + t;
	}
	subN(e, t) {
		return e - t;
	}
	mulN(e, t) {
		return e * t;
	}
	inv(e) {
		return pv(e, this.ORDER);
	}
	sqrt(e) {
		let t = Ev.get(this);
		return t || Ev.set(this, t = bv(this.ORDER)), t(this, e);
	}
	toBytes(e) {
		return this.isLE ? K_(e, this.BYTES) : G_(e, this.BYTES);
	}
	fromBytes(e, t = !1) {
		X(e);
		let { _lengths: n, BYTES: r, isLE: i, ORDER: a, _mod: o } = this;
		if (n) {
			if (e.length < 1 || !n.includes(e.length) || e.length > r) throw Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
			let t = new Uint8Array(r);
			t.set(e, i ? 0 : t.length - e.length), e = t;
		}
		if (e.length !== r) throw Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
		let s = i ? W_(e) : U_(e);
		if (o && (s = dv(s, a)), !t && !this.isValid(s)) throw Error("invalid field element: outside of range 0..ORDER");
		return s;
	}
	invertBatch(e) {
		return Cv(this, e, !0);
	}
	cmov(e, t, n) {
		return z_(n, "condition"), n ? t : e;
	}
};
function Ov(e, t = {}) {
	return Object.freeze(Dv.prototype), new Dv(e, t);
}
function kv(e) {
	if (typeof e != "bigint") throw Error("field order must be bigint");
	if (e <= Q) throw Error("field order must be greater than 1");
	let t = Q_(e - Q);
	return Math.ceil(t / 8);
}
function Av(e) {
	let t = kv(e);
	return t + Math.ceil(t / 2);
}
function jv(e, t, n = !1) {
	X(e);
	let r = e.length, i = kv(t), a = Math.max(Av(t), 16);
	if (r < a || r > 1024) throw Error("expected " + a + "-1024 bytes of input, got " + r);
	let o = dv(n ? W_(e) : U_(e), t - Q) + Q;
	return n ? K_(o, i) : G_(o, i);
}
// node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/curve.js
var Mv = /* @__PURE__ */ BigInt(0), Nv = /* @__PURE__ */ BigInt(1), Pv = /* @__PURE__ */ BigInt(4), Fv = 16, Iv = 128, Lv = 5, Rv = 2 ** 31;
function zv(e) {
	let t = e;
	if (typeof t != "function") throw TypeError("\"Point\" expected constructor, got type=" + typeof e);
	A_(t.fromAffine, "Point.fromAffine"), A_(t.fromBytes, "Point.fromBytes"), A_(t.fromHex, "Point.fromHex"), k_(t.BASE, "Point.BASE"), k_(t.ZERO, "Point.ZERO"), Sv(t.Fp), Sv(t.Fn);
}
function Bv(e, t) {
	zv(e), Wv(t, e);
	let n = Cv(e.Fp, t.map((e) => e.Z));
	return t.map((t, r) => e.fromAffine(t.toAffine(n[r])));
}
function Vv(e, t, n = 1) {
	if (!Number.isSafeInteger(e) || e < n || e > t) throw Error("invalid window size, expected [" + n + ".." + t + "], got W=" + e);
}
function Hv(e, t) {
	let n = e * (4 * t + 128);
	if (n > Rv) throw Error("invalid window size: table would need ~" + Math.ceil(n / 2 ** 20) + " MiB, max " + Rv / 2 ** 20 + " MiB");
}
function Uv(e, t) {
	if (e !== void 0) {
		A_(e, "randomBytes");
		try {
			let n = e(t);
			if (!P_(n) || n.length !== t) return;
		} catch {
			return;
		}
		return e;
	}
}
function Wv(e, t) {
	D_(e, "points"), e.forEach((e, n) => {
		if (!(e instanceof t)) throw Error("invalid point at index " + n);
	});
}
function Gv(e, t, n) {
	if (!Array.isArray(e)) throw Error("array of scalars expected");
	e.forEach((e, r) => {
		if (!(n === void 0 ? t.isValid(e) : Y_(e) && e < n)) throw Error("invalid scalar at index " + r);
	});
}
var Kv = /* @__PURE__ */ new WeakMap();
function qv(e) {
	return Kv.get(e) || 1;
}
function Jv(e, t) {
	let n = e.double(), r = [e];
	for (let e = 1; e < t; e++) r.push(r[e - 1].add(n));
	return r;
}
function Yv(e, t) {
	let n = 2 ** t, r = n / 2, i = BigInt(n - 1), a = [];
	for (; e > Mv;) {
		let t = 0;
		e & Nv && (t = Number(e & i), t >= r && (t -= n), e -= BigInt(t)), a.push(t), e >>= Nv;
	}
	return a;
}
function Xv(e, t, n) {
	let r = 2 ** t, i = r / 2, a = BigInt(r - 1), o = BigInt(t), s = [];
	for (let t = 0; t < n; t++) {
		let t = Number(e & a);
		e >>= o, t > i && (t -= r, e += Nv), s.push(t);
	}
	if (e !== Mv) throw Error("invalid wnaf");
	return s;
}
function Zv(e, t, n) {
	let r = 0;
	for (let e of n) r = Math.max(r, e.length);
	let i = e;
	for (let e = r - 1; e >= 0; e--) {
		e !== r - 1 && (i = i.double());
		for (let r = 0; r < n.length; r++) {
			let a = n[r][e];
			if (a) {
				let e = t[r][Math.abs(a) - 1 >> 1];
				i = i.add(a < 0 ? e.negate() : e);
			}
		}
	}
	return i;
}
var Qv = class {
	Point;
	BASE;
	ZERO;
	randomBytes;
	wnafPrecomputes = /* @__PURE__ */ new WeakMap();
	baseCanBeBlinded;
	bits;
	constructor(e, t) {
		zv(e), this.randomBytes = Uv(t, Fv), this.Point = e, this.BASE = e.BASE, this.ZERO = e.ZERO, this.bits = e.Fn.BITS;
	}
	buildWnafTable(e, t, n) {
		let r = Math.ceil(n / t) + 1, i = 2 ** (t - 1), a = [], o = e;
		for (let e = 0; e < r; e++) {
			let e = o;
			for (let t = 0; t < i; t++) a.push(e), e = e.add(o);
			o = a[a.length - 1].double();
		}
		return {
			W: t,
			bits: n,
			windows: r,
			comp: a
		};
	}
	wnafCachedCT(e, t) {
		let { W: n, windows: r, comp: i } = e, a = 2 ** (n - 1), o = Xv(t, n, r), s = this.ZERO, c = this.BASE;
		for (let e = 0; e < r; e++) {
			let t = o[e], n = e * a, r = Math.abs(t) - 1, l = i[n];
			for (let e = 1; e < a; e++) l = e === r ? i[n + e] : l;
			let u = l.negate();
			t === 0 ? c = c.add(i[n]) : s = s.add(t < 0 ? u : l);
		}
		return {
			p: s,
			f: c
		};
	}
	getWnafPrecomputes(e, t, n, r) {
		let i = this.wnafPrecomputes.get(t), a = i?.find((t) => t.W === e && t.bits === n);
		return a || (a = this.buildWnafTable(t, e, n), typeof r == "function" && (a = {
			...a,
			comp: r(a.comp)
		}), i || (i = [], this.wnafPrecomputes.set(t, i)), i.push(a)), a;
	}
	assertPoint(e) {
		if (!(e instanceof this.Point)) throw TypeError("\"point\" expected Point instance, got type=" + typeof e);
	}
	validateMulInput(e, t) {
		if (this.assertPoint(e), !X_(t, Nv, this.Point.Fn.ORDER)) throw Error("invalid scalar");
	}
	runCT(e, t, n, r) {
		let i = qv(e);
		return i === 1 ? this.fixedWindowCT(e, t, n) : this.wnafCachedCT(this.getWnafPrecomputes(i, e, n, r), t);
	}
	mulCT(e, t, n) {
		return this.validateMulInput(e, t), this.runCT(e, t, this.bits, n);
	}
	mulCTBlinded(e, t, n) {
		if (this.validateMulInput(e, t), this.randomBytes === void 0) throw Error("randomBytes is required for scalar blinding");
		let r = this.Point.Fn.BITS + Iv, i = this.randomBytes(Fv);
		if (!P_(i) || i.length !== Fv) throw Error("randomBytes returned invalid byte array");
		i[0] = i[0] & 63 | 128;
		let a = t + U_(i) * this.Point.Fn.ORDER;
		return this.runCT(e, a, r, n);
	}
	fixedWindowCT(e, t, n) {
		let r = Lv, i = $_(r), a = Array(32);
		a[0] = this.ZERO;
		for (let t = 1; t < 32; t++) a[t] = a[t - 1].add(e);
		let o = Math.ceil(n / r), s = this.ZERO;
		for (let e = o - 1; e >= 0; e--) {
			if (e !== o - 1) for (let e = 0; e < r; e++) s = s.double();
			let n = Number(t >> BigInt(e * r) & i), c = a[0];
			for (let e = 1; e < 32; e++) c = e === n ? a[e] : c;
			s = s.add(c);
		}
		return {
			p: s,
			f: s
		};
	}
	shouldBlind(e, t) {
		return this.randomBytes === void 0 ? !1 : t === Nv || e === this.BASE && (this.baseCanBeBlinded === void 0 && (this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0()), this.baseCanBeBlinded);
	}
	mulSecret(e, t, n, r) {
		return this.shouldBlind(e, n) ? this.mulCTBlinded(e, t, r) : this.mulCT(e, t, r);
	}
	mulUnsafe(e, t, n) {
		if (this.assertPoint(e), !Y_(t)) throw Error("invalid scalar");
		let r = qv(e);
		if (r === 1 || t >= this.Point.Fn.ORDER) return $v(this.Point, [e], [t], !0);
		let i = this.getWnafPrecomputes(r, e, this.bits, n);
		return this.wnafCachedCT(i, t).p;
	}
	setWindowSize(e, t) {
		this.assertPoint(e), Vv(t, this.bits), Hv((Math.ceil((this.bits + Iv) / t) + 1) * 2 ** (t - 1), this.Point.Fp.BYTES), Kv.set(e, t), this.wnafPrecomputes.delete(e);
	}
	hasWindowSize(e) {
		return qv(e) !== 1;
	}
};
function $v(e, t, n, r = !1) {
	if (zv(e), Wv(t, e), z_(r, "allowOversized"), Gv(n, e.Fn, r ? e.Fn.ORDER ** Pv : void 0), t.length !== n.length) throw Error("arrays of points and scalars must have equal length");
	let i = t.map((e) => Jv(e, 4)), a = n.map((e) => Yv(e, 4));
	return Zv(e.ZERO, i, a);
}
function ey(e, t, n) {
	if (t) {
		if (t.ORDER !== e) throw Error("Field.ORDER must match order: Fp == p, Fn == n");
		return Sv(t), t;
	}
	return Ov(e, { isLE: n });
}
function ty(e, t, n = {}, r) {
	if (e !== "weierstrass" && e !== "edwards") throw Error("expected curve type \"weierstrass\" or \"edwards\"");
	if (r === void 0 && (r = e === "edwards"), !t || typeof t != "object") throw Error(`expected valid ${e} CURVE object`);
	ev(n);
	for (let e of [
		"p",
		"n",
		"h"
	]) {
		let n = t[e];
		if (!(Y_(n) && n !== Mv)) throw Error(`CURVE.${e} must be positive bigint`);
	}
	let i = ey(t.p, n.Fp, r), a = ey(t.n, n.Fn, r), o = [
		"Gx",
		"Gy",
		"a",
		e === "weierstrass" ? "b" : "d"
	];
	for (let e of o) if (!i.isValid(t[e])) throw Error(`CURVE.${e} must be valid field element of CURVE.Fp`);
	return t = Object.freeze(Object.assign({}, t)), {
		CURVE: t,
		Fp: i,
		Fn: a
	};
}
function ny(e, t) {
	return function(n) {
		let r = e(n);
		return {
			secretKey: r,
			publicKey: t(r)
		};
	};
}
// node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/abstract/weierstrass.js
var ry = (e, t) => (e + (e >= 0 ? t : -t) / sy) / t;
function iy(e, t, n) {
	Z_("scalar", e, ay, n);
	let [[r, i], [a, o]] = t, s = ry(o * e, n), c = ry(-i * e, n), l = e - s * r - c * a, u = -s * i - c * o, d = l < ay, f = u < ay;
	d && (l = -l), f && (u = -u);
	let p = $_(Math.ceil(Q_(n) / 2)) + oy;
	if (l < ay || l >= p || u < ay || u >= p) throw Error("splitScalar (endomorphism): failed for k");
	return {
		k1neg: d,
		k1: l,
		k2neg: f,
		k2: u
	};
}
var ay = /* @__PURE__ */ BigInt(0), oy = /* @__PURE__ */ BigInt(1), sy = /* @__PURE__ */ BigInt(2), cy = /* @__PURE__ */ BigInt(3), ly = /* @__PURE__ */ BigInt(4);
function uy(e, t = {}) {
	let n = ty("weierstrass", e, t), r = n.Fp, i = n.Fn, a = n.CURVE, { h: o, n: s } = a;
	ev(t, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object",
		randomBytes: "function"
	});
	let { endo: c, allowInfinityPoint: l, clearCofactor: u, isTorsionFree: d, fromBytes: f, toBytes: p } = t, m = t.randomBytes === void 0 ? F_ : t.randomBytes;
	if (c && (!r.is0(a.a) || typeof c.beta != "bigint" || !Array.isArray(c.basises))) throw Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	let h = c ? {
		beta: c.beta,
		basises: c.basises.map((e) => [...e])
	} : void 0, g = fy(r, i);
	function ee() {
		if (!r.isOdd) throw Error("compression is not supported: Field does not have .isOdd()");
	}
	function te(e, t, n) {
		if (t.is0()) {
			if (!l) throw Error("bad point: ZERO");
			return Uint8Array.of(0);
		}
		let { x: i, y: a } = t.toAffine(), o = r.toBytes(i);
		return z_(n, "isCompressed"), n ? (ee(), M_(dy(!r.isOdd(a)), o)) : M_(Uint8Array.of(4), o, r.toBytes(a));
	}
	function ne(e) {
		X(e, void 0, "Point");
		let { publicKey: t, publicKeyUncompressed: n } = g, i = e.length, a = e[0], o = e.subarray(1);
		if (l && i === 1 && a === 0) return {
			x: r.ZERO,
			y: r.ZERO
		};
		if (i === t && (a === 2 || a === 3)) {
			let e = r.fromBytes(o);
			if (!r.isValid(e)) throw Error("bad point: is not on curve, wrong x");
			let t = oe(e), n;
			try {
				n = r.sqrt(t);
			} catch (e) {
				let t = e instanceof Error ? ": " + e.message : "";
				throw Error("bad point: is not on curve, sqrt error" + t);
			}
			ee();
			let i = r.isOdd(n);
			return (a & 1) == 1 !== i && (n = r.neg(n)), {
				x: e,
				y: n
			};
		}
		if (i === n && a === 4) {
			let e = r.BYTES, t = r.fromBytes(o.subarray(0, e)), n = r.fromBytes(o.subarray(e, e * 2));
			if (!se(t, n)) throw Error("bad point: is not on curve");
			return {
				x: t,
				y: n
			};
		}
		throw Error(`bad point: got length ${i}, expected compressed=${t} or uncompressed=${n}`);
	}
	let re = p === void 0 ? te : p, ie = f === void 0 ? ne : f, ae = r.mul(a.b, cy), _ = r.is0(a.a) ? (e) => r.ZERO : (e) => r.mul(a.a, e);
	function oe(e) {
		let t = r.sqr(e), n = r.mul(t, e);
		return r.add(r.add(n, r.mul(e, a.a)), a.b);
	}
	function se(e, t) {
		let n = r.sqr(t), i = oe(e);
		return r.eql(n, i);
	}
	if (!se(a.Gx, a.Gy)) throw Error("bad curve params: generator point");
	let ce = r.mul(r.pow(a.a, cy), ly), le = r.mul(r.sqr(a.b), BigInt(27));
	if (r.is0(r.add(ce, le))) throw Error("bad curve params: a or b");
	function ue(e, t, n = !1) {
		if (!r.isValid(t) || n && r.is0(t)) throw Error(`bad point coordinate ${e}`);
		return typeof t == "object" && t ? r.create(t) : t;
	}
	function de(e) {
		if (!(e instanceof y)) throw Error("Weierstrass Point expected");
	}
	function fe(e) {
		if (!h || !h.basises) throw Error("no endo");
		return iy(e, h.basises, i.ORDER);
	}
	function pe(e, t, n, a) {
		if (!i.isValid(a)) throw RangeError("invalid scalar: out of range");
		if (h) {
			let { k1neg: i, k1: o, k2neg: s, k2: c } = fe(a), l = new y(r.mul(n.X, h.beta), n.Y, n.Z);
			e.push(i ? n.negate() : n, s ? l.negate() : l), t.push(o, c);
		} else e.push(n), t.push(a);
	}
	let v = /* @__PURE__ */ new WeakSet();
	class y {
		static BASE = new y(a.Gx, a.Gy, r.ONE);
		static ZERO = new y(r.ZERO, r.ONE, r.ZERO);
		static Fp = r;
		static Fn = i;
		X;
		Y;
		Z;
		constructor(e, t, n) {
			this.X = ue("x", e), this.Y = ue("y", t, !0), this.Z = ue("z", n), Object.freeze(this);
		}
		static CURVE() {
			return a;
		}
		static fromAffine(e) {
			let { x: t, y: n } = e || {};
			if (!e || !r.isValid(t) || !r.isValid(n)) throw Error("invalid affine point");
			if (e instanceof y) throw Error("projective point not allowed");
			return r.is0(t) && r.is0(n) ? y.ZERO : new y(t, n, r.ONE);
		}
		static fromBytes(e) {
			let t = y.fromAffine(ie(X(e, void 0, "point")));
			return t.assertValidity(), t;
		}
		static fromHex(e) {
			return y.fromBytes(N_(e));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(e = 6, t = !0) {
			return b.setWindowSize(this, e), t || this.multiply(cy), this;
		}
		assertValidity() {
			let e = this;
			if (e.is0()) {
				if (l && r.is0(e.X) && r.eql(e.Y, r.ONE) && r.is0(e.Z)) return;
				throw Error("bad point: ZERO");
			}
			if (v.has(e)) return;
			let { x: t, y: n } = e.toAffine();
			if (!r.isValid(t) || !r.isValid(n)) throw Error("bad point: x or y not field elements");
			if (!se(t, n)) throw Error("bad point: equation left != right");
			if (!e.isTorsionFree()) throw Error("bad point: not in prime-order subgroup");
			v.add(e);
		}
		hasEvenY() {
			let { y: e } = this.toAffine();
			if (!r.isOdd) throw Error("Field doesn't support isOdd");
			return !r.isOdd(e);
		}
		equals(e) {
			de(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: o, Z: s } = e, c = r.eql(r.mul(t, s), r.mul(a, i)), l = r.eql(r.mul(n, s), r.mul(o, i));
			return c && l;
		}
		negate() {
			return new y(this.X, r.neg(this.Y), this.Z);
		}
		double() {
			let { X: e, Y: t, Z: n } = this, i = r.ZERO, a = r.ZERO, o = r.ZERO, s = r.mul(e, e), c = r.mul(t, t), l = r.mul(n, n), u = r.mul(e, t);
			return u = r.add(u, u), o = r.mul(e, n), o = r.add(o, o), i = _(o), a = r.mul(ae, l), a = r.add(i, a), i = r.sub(c, a), a = r.add(c, a), a = r.mul(i, a), i = r.mul(u, i), o = r.mul(ae, o), l = _(l), u = r.sub(s, l), u = _(u), u = r.add(u, o), o = r.add(s, s), s = r.add(o, s), s = r.add(s, l), s = r.mul(s, u), a = r.add(a, s), l = r.mul(t, n), l = r.add(l, l), s = r.mul(l, u), i = r.sub(i, s), o = r.mul(l, c), o = r.add(o, o), o = r.add(o, o), new y(i, a, o);
		}
		add(e) {
			de(e);
			let { X: t, Y: n, Z: i } = this, { X: a, Y: o, Z: s } = e, c = r.ZERO, l = r.ZERO, u = r.ZERO, d = r.mul(t, a), f = r.mul(n, o), p = r.mul(i, s), m = r.add(t, n), h = r.add(a, o);
			m = r.mul(m, h), h = r.add(d, f), m = r.sub(m, h), h = r.add(t, i);
			let g = r.add(a, s);
			return h = r.mul(h, g), g = r.add(d, p), h = r.sub(h, g), g = r.add(n, i), c = r.add(o, s), g = r.mul(g, c), c = r.add(f, p), g = r.sub(g, c), u = _(h), c = r.mul(ae, p), u = r.add(c, u), c = r.sub(f, u), u = r.add(f, u), l = r.mul(c, u), f = r.add(d, d), f = r.add(f, d), p = _(p), h = r.mul(ae, h), f = r.add(f, p), p = r.sub(d, p), p = _(p), h = r.add(h, p), d = r.mul(f, h), l = r.add(l, d), d = r.mul(g, h), c = r.mul(m, c), c = r.sub(c, d), d = r.mul(m, f), u = r.mul(g, u), u = r.add(u, d), new y(c, l, u);
		}
		subtract(e) {
			return de(e), this.add(e.negate());
		}
		is0() {
			return this.equals(y.ZERO);
		}
		multiply(e) {
			if (!i.isValidNot0(e)) throw RangeError("invalid scalar: out of range");
			let { p: t, f: n } = b.mulSecret(this, e, o, me);
			return me([t, n])[0];
		}
		multiplyUnsafe(e) {
			let t = this, n = e;
			if (!i.isValid(n)) throw RangeError("invalid scalar: out of range");
			if (n === ay || t.is0()) return y.ZERO;
			if (n === oy) return t;
			if (b.hasWindowSize(this)) return b.mulUnsafe(t, n, me);
			let r = [], a = [];
			return pe(r, a, t, n), $v(y, r, a);
		}
		mulAddUnsafe(e, t, n) {
			de(t);
			let r = [], i = [];
			return pe(r, i, this, e), pe(r, i, t, n), $v(y, r, i);
		}
		toAffine(e) {
			let t = this, n = e;
			if (n != null && !r.isValid(n)) throw RangeError("\"invertedZ\" expected valid field element");
			let { X: i, Y: a, Z: o } = t;
			if (r.eql(o, r.ONE)) return {
				x: i,
				y: a
			};
			let s = t.is0();
			n ??= s ? r.ONE : r.inv(o);
			let c = r.mul(i, n), l = r.mul(a, n), u = r.mul(o, n);
			if (s) return {
				x: r.ZERO,
				y: r.ZERO
			};
			if (!r.eql(u, r.ONE)) throw Error("invZ was invalid");
			return {
				x: c,
				y: l
			};
		}
		isTorsionFree() {
			return o === oy ? !0 : d ? d(y, this) : b.mulUnsafe(this, s).is0();
		}
		clearCofactor() {
			return o === oy ? this : u ? u(y, this) : this.multiplyUnsafe(o);
		}
		isSmallOrder() {
			return o === oy ? this.is0() : this.clearCofactor().is0();
		}
		toBytes(e = !0) {
			return z_(e, "isCompressed"), this.assertValidity(), re(y, this, e);
		}
		toHex(e = !0) {
			return j_(this.toBytes(e));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	let me = (e) => Bv(y, e), b = new Qv(y, m);
	return b.bits >= 6 && y.BASE.precompute(6), Object.freeze(y.prototype), Object.freeze(y), y;
}
function dy(e) {
	return Uint8Array.of(e ? 2 : 3);
}
function fy(e, t) {
	return {
		secretKey: t.BYTES,
		publicKey: 1 + e.BYTES,
		publicKeyUncompressed: 1 + 2 * e.BYTES,
		publicKeyHasPrefix: !0,
		signature: 2 * t.BYTES
	};
}
// node_modules/.pnpm/@noble+curves@2.4.0/node_modules/@noble/curves/secp256k1.js
var py = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
	n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
	h: BigInt(1),
	a: BigInt(0),
	b: BigInt(7),
	Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
	Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
}, my = {
	beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
	basises: [[BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")], [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]]
}, hy = /* @__PURE__ */ BigInt(0), gy = /* @__PURE__ */ BigInt(2);
function _y(e) {
	let t = py.p, n = BigInt(3), r = BigInt(6), i = BigInt(11), a = BigInt(22), o = BigInt(23), s = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, d = $($($(u, n, t) * u % t, n, t) * u % t, gy, t) * l % t, f = $(d, i, t) * d % t, p = $(f, a, t) * f % t, m = $(p, s, t) * p % t, h = $($($($($($(m, c, t) * m % t, s, t) * p % t, n, t) * u % t, o, t) * f % t, r, t) * l % t, gy, t);
	if (!vy.eql(vy.sqr(h), e)) throw Error("Cannot find square root");
	return h;
}
var vy = /* @__PURE__ */ Ov(py.p, { sqrt: _y }), yy = /* @__PURE__ */ uy(py, {
	Fp: vy,
	endo: my
}), by = Object.create(null);
function xy(e, ...t) {
	let n = by[e];
	if (n === void 0) {
		let t = E_(J_(e));
		n = M_(t, t), by[e] = n;
	}
	return E_(M_(n, ...t));
}
var Sy = (e) => e.toBytes(!0).slice(1), Cy = ({ x: e }) => vy.toBytes(e), wy = (e) => !vy.isOdd(e);
function Ty(e) {
	let { Fn: t, BASE: n } = yy, r = t.fromBytes(X(e, 32, "secretKey")), i = n.multiply(r).toAffine();
	return {
		scalar: wy(i.y) ? r : t.neg(r),
		bytes: Cy(i)
	};
}
function Ey(e) {
	let t = vy;
	if (!t.isValidNot0(e)) throw Error("invalid x: Fail if x ≥ p");
	let n = t.sqr(e), r = t.add(t.mulN(n, e), BigInt(7)), i = t.sqrt(r);
	wy(i) || (i = t.neg(i));
	let a = yy.fromAffine({
		x: e,
		y: i
	});
	return a.assertValidity(), a;
}
var Dy = U_;
function Oy(...e) {
	return yy.Fn.create(Dy(xy("BIP0340/challenge", ...e)));
}
function ky(e) {
	return Ty(e).bytes;
}
function Ay(e, t, n = g_(32)) {
	let { Fn: r, BASE: i } = yy, a = q_(X(e, void 0, "message")), { bytes: o, scalar: s } = Ty(t), c = X(n, 32, "auxRand"), l = xy("BIP0340/nonce", r.toBytes(s ^ Dy(xy("BIP0340/aux", c))), o, a), u = r.create(Dy(l));
	if (u === hy) throw Error("sign failed: k is zero");
	let d = i.multiply(u).toAffine(), f = wy(d.y) ? u : r.neg(u), p = Cy(d), m = Oy(p, o, a), h = /* @__PURE__ */ new Uint8Array(64);
	if (h.set(p, 0), h.set(r.toBytes(r.create(f + m * s)), 32), !jy(h, a, o)) throw Error("sign: Invalid signature produced");
	return h;
}
function jy(e, t, n) {
	let { Fp: r, Fn: i, BASE: a } = yy, o = X(e, 64, "signature"), s = X(t, void 0, "message"), c = X(n, 32, "publicKey");
	try {
		let e = Ey(Dy(c)), t = o.subarray(0, 32), n = Dy(t);
		if (!r.isValidNot0(n)) return !1;
		let l = Dy(o.subarray(32, 64));
		if (!i.isValidNot0(l)) return !1;
		let u = Oy(t, Sy(e), s), d = a.mulAddUnsafe(l, e, i.neg(u)), { x: f, y: p } = d.toAffine();
		return !(d.is0() || !wy(p) || !r.eql(f, n));
	} catch {
		return !1;
	}
}
var My = /* @__PURE__ */ (() => {
	let e = (e) => (e = e === void 0 ? g_(48) : e, jv(X(e, 48, "seed"), py.n));
	return Object.freeze({
		keygen: ny(e, ky),
		getPublicKey: ky,
		sign: Ay,
		verify: jy,
		Point: yy,
		utils: Object.freeze({
			randomSecretKey: e,
			taggedHash: xy,
			lift_x: Ey,
			pointToBytes: Sy
		}),
		lengths: Object.freeze({
			secretKey: 32,
			publicKey: 32,
			publicKeyHasPrefix: !1,
			signature: 64,
			seed: 48
		})
	});
})();
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/utils/data/isHex.js
function Ny(e, { even: t = !1, strict: n = !0 } = {}) {
	return !e || typeof e != "string" || t && e.length % 2 != 0 ? !1 : n ? /^0x[0-9a-fA-F]*$/.test(e) : e.startsWith("0x");
}
var Py = o((() => {}));
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/utils/data/size.js
function Fy(e) {
	return Ny(e, { strict: !1 }) ? Math.ceil((e.length - 2) / 2) : e.length;
}
var Iy = o((() => {
	Py();
})), Ly, Ry = o((() => {
	Ly = "2.57.17";
}));
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/errors/base.js
function zy(e, t) {
	return t?.(e) ? e : e && typeof e == "object" && "cause" in e && e.cause !== void 0 ? zy(e.cause, t) : t ? null : e;
}
var By, Vy, Hy = o((() => {
	Ry(), By = {
		getDocsUrl: ({ docsBaseUrl: e, docsPath: t = "", docsSlug: n }) => t ? `${e ?? "https://viem.sh"}${t}${n ? `#${n}` : ""}` : void 0,
		version: `viem@${Ly}`
	}, Vy = class e extends Error {
		constructor(t, n = {}) {
			let r = n.cause instanceof e ? n.cause.details : n.cause?.message ? n.cause.message : n.details, i = n.cause instanceof e && n.cause.docsPath || n.docsPath, a = By.getDocsUrl?.({
				...n,
				docsPath: i
			}), o = [
				t || "An error occurred.",
				"",
				...n.metaMessages ? [...n.metaMessages, ""] : [],
				...a ? [`Docs: ${a}`] : [],
				...r ? [`Details: ${r}`] : [],
				...By.version ? [`Version: ${By.version}`] : []
			].join("\n");
			super(o, n.cause ? { cause: n.cause } : void 0), Object.defineProperty(this, "details", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "docsPath", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "metaMessages", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "shortMessage", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "version", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: void 0
			}), Object.defineProperty(this, "name", {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: "BaseError"
			}), this.details = r, this.docsPath = i, this.metaMessages = n.metaMessages, this.name = n.name ?? this.name, this.shortMessage = t, this.version = Ly;
		}
		walk(e) {
			return zy(this, e);
		}
	};
})), Uy, Wy = o((() => {
	Hy(), Uy = class extends Vy {
		constructor({ size: e, targetSize: t, type: n }) {
			super(`${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()} size (${e}) exceeds padding size (${t}).`, { name: "SizeExceedsPaddingSizeError" });
		}
	};
}));
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/utils/data/pad.js
function Gy(e, { dir: t, size: n = 32 } = {}) {
	return typeof e == "string" ? Ky(e, {
		dir: t,
		size: n
	}) : qy(e, {
		dir: t,
		size: n
	});
}
function Ky(e, { dir: t, size: n = 32 } = {}) {
	if (n === null) return e;
	let r = e.replace("0x", "");
	if (r.length > n * 2) throw new Uy({
		size: Math.ceil(r.length / 2),
		targetSize: n,
		type: "hex"
	});
	return `0x${r[t === "right" ? "padEnd" : "padStart"](n * 2, "0")}`;
}
function qy(e, { dir: t, size: n = 32 } = {}) {
	if (n === null) return e;
	if (e.length > n) throw new Uy({
		size: e.length,
		targetSize: n,
		type: "bytes"
	});
	let r = new Uint8Array(n);
	for (let i = 0; i < n; i++) {
		let a = t === "right";
		r[a ? i : n - i - 1] = e[a ? i : e.length - i - 1];
	}
	return r;
}
var Jy = o((() => {
	Wy();
})), Yy, Xy, Zy = o((() => {
	Hy(), Yy = class extends Vy {
		constructor({ max: e, min: t, signed: n, size: r, value: i }) {
			super(`Number "${i}" is not in safe ${r ? `${r * 8}-bit ${n ? "signed" : "unsigned"} ` : ""}integer range ${e ? `(${t} to ${e})` : `(above ${t})`}`, { name: "IntegerOutOfRangeError" });
		}
	}, Xy = class extends Vy {
		constructor({ givenSize: e, maxSize: t }) {
			super(`Size cannot exceed ${t} bytes. Given size: ${e} bytes.`, { name: "SizeOverflowError" });
		}
	};
}));
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/utils/encoding/fromHex.js
function Qy(e, { size: t }) {
	if (Fy(e) > t) throw new Xy({
		givenSize: Fy(e),
		maxSize: t
	});
}
var $y = o((() => {
	Zy(), Iy();
}));
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toHex.js
function eb(e, t = {}) {
	return typeof e == "number" || typeof e == "bigint" ? rb(e, t) : typeof e == "string" ? ib(e, t) : typeof e == "boolean" ? tb(e, t) : nb(e, t);
}
function tb(e, t = {}) {
	let n = `0x${Number(e)}`;
	return typeof t.size == "number" ? (Qy(n, { size: t.size }), Gy(n, { size: t.size })) : n;
}
function nb(e, t = {}) {
	let n = "";
	for (let t = 0; t < e.length; t++) n += ab[e[t]];
	let r = `0x${n}`;
	return typeof t.size == "number" ? (Qy(r, { size: t.size }), Gy(r, {
		dir: "right",
		size: t.size
	})) : r;
}
function rb(e, t = {}) {
	let { signed: n, size: r } = t, i = BigInt(e), a;
	r ? a = n ? (1n << BigInt(r) * 8n - 1n) - 1n : 2n ** (BigInt(r) * 8n) - 1n : typeof e == "number" && (a = BigInt(2 ** 53 - 1));
	let o = typeof a == "bigint" && n ? -a - 1n : 0;
	if (a && i > a || i < o) {
		let t = typeof e == "bigint" ? "n" : "";
		throw new Yy({
			max: a ? `${a}${t}` : void 0,
			min: `${o}${t}`,
			signed: n,
			size: r,
			value: `${e}${t}`
		});
	}
	let s = `0x${(n && i < 0 ? (1n << BigInt(r * 8)) + BigInt(i) : i).toString(16)}`;
	return r ? Gy(s, { size: r }) : s;
}
function ib(e, t = {}) {
	return nb(ob.encode(e), t);
}
var ab, ob, sb = o((() => {
	Zy(), Jy(), $y(), ab = /*#__PURE__*/ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0")), ob = /*#__PURE__*/ new TextEncoder();
}));
// node_modules/.pnpm/viem@2.57.17_typescript@7.0.2_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toBytes.js
function cb(e, t = {}) {
	return typeof e == "number" || typeof e == "bigint" ? fb(e, t) : typeof e == "boolean" ? lb(e, t) : Ny(e) ? db(e, t) : pb(e, t);
}
function lb(e, t = {}) {
	let n = /* @__PURE__ */ new Uint8Array(1);
	return n[0] = Number(e), typeof t.size == "number" ? (Qy(n, { size: t.size }), Gy(n, { size: t.size })) : n;
}
function ub(e) {
	if (e >= hb.zero && e <= hb.nine) return e - hb.zero;
	if (e >= hb.A && e <= hb.F) return e - (hb.A - 10);
	if (e >= hb.a && e <= hb.f) return e - (hb.a - 10);
}
function db(e, t = {}) {
	let n = e;
	t.size && (Qy(n, { size: t.size }), n = Gy(n, {
		dir: "right",
		size: t.size
	}));
	let r = n.slice(2);
	r.length % 2 && (r = `0${r}`);
	let i = r.length / 2, a = new Uint8Array(i);
	for (let e = 0, t = 0; e < i; e++) {
		let n = ub(r.charCodeAt(t++)), i = ub(r.charCodeAt(t++));
		if (n === void 0 || i === void 0) throw new Vy(`Invalid byte sequence ("${r[t - 2]}${r[t - 1]}" in "${r}").`);
		a[e] = n * 16 + i;
	}
	return a;
}
function fb(e, t) {
	return db(rb(e, t));
}
function pb(e, t = {}) {
	let n = mb.encode(e);
	return typeof t.size == "number" ? (Qy(n, { size: t.size }), Gy(n, {
		dir: "right",
		size: t.size
	})) : n;
}
var mb, hb, gb = o((() => {
	Hy(), Py(), Jy(), $y(), sb(), mb = /*#__PURE__*/ new TextEncoder(), hb = {
		zero: 48,
		nine: 57,
		A: 65,
		F: 70,
		a: 97,
		f: 102
	};
}));
// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js
function _b(e) {
	return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function vb(e, ...t) {
	if (!_b(e)) throw Error("Uint8Array expected");
	if (t.length > 0 && !t.includes(e.length)) throw Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function yb(e, t = !0) {
	if (e.destroyed) throw Error("Hash instance has been destroyed");
	if (t && e.finished) throw Error("Hash#digest() has already been called");
}
function bb(e, t) {
	vb(e);
	let n = t.outputLen;
	if (e.length < n) throw Error("digestInto() expects output buffer of length at least " + n);
}
function xb(...e) {
	for (let t = 0; t < e.length; t++) e[t].fill(0);
}
function Sb(e) {
	return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Cb(e, t) {
	return e << 32 - t | e >>> t;
}
function wb(e) {
	if (typeof e != "string") throw Error("string expected");
	return new Uint8Array(new TextEncoder().encode(e));
}
function Tb(e) {
	return typeof e == "string" && (e = wb(e)), vb(e), e;
}
function Eb(e) {
	let t = (t) => e().update(Tb(t)).digest(), n = e();
	return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
var Db, Ob = o((() => {
	Db = class {};
}));
// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_md.js
function kb(e, t, n, r) {
	if (typeof e.setBigUint64 == "function") return e.setBigUint64(t, n, r);
	let i = BigInt(32), a = BigInt(4294967295), o = Number(n >> i & a), s = Number(n & a), c = r ? 4 : 0, l = r ? 0 : 4;
	e.setUint32(t + c, o, r), e.setUint32(t + l, s, r);
}
function Ab(e, t, n) {
	return e & t ^ ~e & n;
}
function jb(e, t, n) {
	return e & t ^ e & n ^ t & n;
}
var Mb, Nb, Pb = o((() => {
	Ob(), Mb = class extends Db {
		constructor(e, t, n, r) {
			super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = Sb(this.buffer);
		}
		update(e) {
			yb(this), e = Tb(e), vb(e);
			let { view: t, buffer: n, blockLen: r } = this, i = e.length;
			for (let a = 0; a < i;) {
				let o = Math.min(r - this.pos, i - a);
				if (o === r) {
					let t = Sb(e);
					for (; r <= i - a; a += r) this.process(t, a);
				} else n.set(e.subarray(a, a + o), this.pos), this.pos += o, a += o, this.pos === r && (this.process(t, 0), this.pos = 0);
			}
			return this.length += e.length, this.roundClean(), this;
		}
		digestInto(e) {
			yb(this), bb(e, this), this.finished = !0;
			let { buffer: t, view: n, blockLen: r, isLE: i } = this, { pos: a } = this;
			t[a++] = 128, xb(this.buffer.subarray(a)), this.padOffset > r - a && (this.process(n, 0), a = 0);
			for (let e = a; e < r; e++) t[e] = 0;
			kb(n, r - 8, BigInt(this.length * 8), i), this.process(n, 0);
			let o = Sb(e), s = this.outputLen;
			if (s % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
			let c = s / 4, l = this.get();
			if (c > l.length) throw Error("_sha2: outputLen bigger than state");
			for (let e = 0; e < c; e++) o.setUint32(4 * e, l[e], i);
		}
		digest() {
			let { buffer: e, outputLen: t } = this;
			this.digestInto(e);
			let n = e.slice(0, t);
			return this.destroy(), n;
		}
		_cloneInto(e) {
			e ||= new this.constructor(), e.set(...this.get());
			let { blockLen: t, buffer: n, length: r, finished: i, destroyed: a, pos: o } = this;
			return e.destroyed = a, e.finished = i, e.length = r, e.pos = o, r % t && e.buffer.set(n), e;
		}
		clone() {
			return this._cloneInto();
		}
	}, Nb = /* @__PURE__ */ Uint32Array.from([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
})), Fb, Ib, Lb, Rb;
// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha256.js
o((() => {
	Pb(), Ob(), Fb = /* @__PURE__ */ Uint32Array.from([
		1116352408,
		1899447441,
		3049323471,
		3921009573,
		961987163,
		1508970993,
		2453635748,
		2870763221,
		3624381080,
		310598401,
		607225278,
		1426881987,
		1925078388,
		2162078206,
		2614888103,
		3248222580,
		3835390401,
		4022224774,
		264347078,
		604807628,
		770255983,
		1249150122,
		1555081692,
		1996064986,
		2554220882,
		2821834349,
		2952996808,
		3210313671,
		3336571891,
		3584528711,
		113926993,
		338241895,
		666307205,
		773529912,
		1294757372,
		1396182291,
		1695183700,
		1986661051,
		2177026350,
		2456956037,
		2730485921,
		2820302411,
		3259730800,
		3345764771,
		3516065817,
		3600352804,
		4094571909,
		275423344,
		430227734,
		506948616,
		659060556,
		883997877,
		958139571,
		1322822218,
		1537002063,
		1747873779,
		1955562222,
		2024104815,
		2227730452,
		2361852424,
		2428436474,
		2756734187,
		3204031479,
		3329325298
	]), Ib = /* @__PURE__ */ new Uint32Array(64), Lb = class extends Mb {
		constructor(e = 32) {
			super(64, e, 8, !1), this.A = Nb[0] | 0, this.B = Nb[1] | 0, this.C = Nb[2] | 0, this.D = Nb[3] | 0, this.E = Nb[4] | 0, this.F = Nb[5] | 0, this.G = Nb[6] | 0, this.H = Nb[7] | 0;
		}
		get() {
			let { A: e, B: t, C: n, D: r, E: i, F: a, G: o, H: s } = this;
			return [
				e,
				t,
				n,
				r,
				i,
				a,
				o,
				s
			];
		}
		set(e, t, n, r, i, a, o, s) {
			this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = a | 0, this.G = o | 0, this.H = s | 0;
		}
		process(e, t) {
			for (let n = 0; n < 16; n++, t += 4) Ib[n] = e.getUint32(t, !1);
			for (let e = 16; e < 64; e++) {
				let t = Ib[e - 15], n = Ib[e - 2], r = Cb(t, 7) ^ Cb(t, 18) ^ t >>> 3, i = Cb(n, 17) ^ Cb(n, 19) ^ n >>> 10;
				Ib[e] = i + Ib[e - 7] + r + Ib[e - 16] | 0;
			}
			let { A: n, B: r, C: i, D: a, E: o, F: s, G: c, H: l } = this;
			for (let e = 0; e < 64; e++) {
				let t = Cb(o, 6) ^ Cb(o, 11) ^ Cb(o, 25), u = l + t + Ab(o, s, c) + Fb[e] + Ib[e] | 0, d = (Cb(n, 2) ^ Cb(n, 13) ^ Cb(n, 22)) + jb(n, r, i) | 0;
				l = c, c = s, s = o, o = a + u | 0, a = i, i = r, r = n, n = u + d | 0;
			}
			n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, a = a + this.D | 0, o = o + this.E | 0, s = s + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, a, o, s, c, l);
		}
		roundClean() {
			xb(Ib);
		}
		destroy() {
			this.set(0, 0, 0, 0, 0, 0, 0, 0), xb(this.buffer);
		}
	}, Rb = /* @__PURE__ */ Eb(() => new Lb());
}))();
var zb = Rb;
Py(), gb(), sb();
function Bb(e, t) {
	let n = t || "hex", r = zb(Ny(e, { strict: !1 }) ? cb(e) : e);
	return n === "bytes" ? r : eb(r);
}
// src/verify.ts
gb();
var Vb = (e) => db(`0x${e}`), Hb = (e) => pb(e);
function Ub(e) {
	return Bb(Hb(JSON.stringify([
		0,
		e.pubkey,
		e.created_at,
		e.kind,
		e.tags,
		e.content
	]))).slice(2);
}
function Wb(e) {
	let t = Ub(e) === e.id, n = !1;
	try {
		n = t && My.verify(Vb(e.sig), Vb(e.id), Vb(e.pubkey));
	} catch {
		n = !1;
	}
	return {
		id: e.id,
		idMatches: t,
		signatureValid: n
	};
}
function Gb(e) {
	let t = e.map(Wb);
	return {
		results: t,
		allValid: t.every((e) => e.idMatches && e.signatureValid)
	};
}
// src/viewer.ts
var Kb = new URLSearchParams(location.search), qb = Kb.get("piece"), Jb = Kb.getAll("src").filter((e) => /^https:\/\//.test(e)), Yb = document.getElementById("badge"), Xb = document.getElementById("list"), Zb = document.getElementById("where");
Zb.textContent = qb ? `piece ${qb}` : "no piece CID in the URL";
async function Qb() {
	for (let e of Jb) try {
		let t = await fetch(e);
		if (t.ok) return {
			bytes: new Uint8Array(await t.arrayBuffer()),
			src: e
		};
	} catch {}
	throw Error(Jb.length ? "no storage provider answered" : "no provider URL in the link");
}
function $b(e, t, n) {
	let r = Gb(e).results.map((t, n) => ({
		e: e[n],
		ok: t.idMatches && t.signatureValid
	})), i = r.filter((e) => e.ok).length;
	Yb.className = "badge " + (i === r.length ? "ok" : "bad"), Yb.textContent = i === r.length ? `✓ ${i} of ${r.length} signatures verified on this device` : `✗ ${r.length - i} of ${r.length} signatures failed`, Zb.textContent = `${t?.agent ?? "agent"} · ${t?.sealedAt ?? ""} · served by ${new URL(n).host}`;
	for (let { e, ok: t } of r) {
		let n = document.createElement("div");
		n.className = "msg", n.innerHTML = `<div class="meta"><span>${(/* @__PURE__ */ new Date(e.created_at * 1e3)).toLocaleString()}</span><span><code>${e.pubkey.slice(0, 8)}…</code></span><span class="${t ? "v" : "x"}">${t ? "signature valid" : "SIGNATURE INVALID"}</span></div><pre></pre>`, n.querySelector("pre").textContent = e.content, Xb.appendChild(n);
	}
}
try {
	let { bytes: e, src: t } = await Qb(), { events: n, manifest: r } = await qg(e);
	if (!n.length) throw Error("seal has no events.ndjson");
	$b(n, r, t);
} catch (e) {
	Yb.className = "badge bad", Yb.textContent = `Could not open the seal: ${e.message}`;
}
