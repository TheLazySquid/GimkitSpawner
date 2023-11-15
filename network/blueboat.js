// this code was stolen from the original Gimkit Util extension
function n(t, e, n) {
    for (var i = 0, s = 0, o = n.length; s < o; s++)(i = n.charCodeAt(s)) < 128 ? t.setUint8(e++, i) : (i < 2048 ? t.setUint8(e++, 192 | i >> 6) : (i < 55296 || 57344 <= i ? t.setUint8(e++, 224 | i >> 12) : (s++, i = 65536 + ((1023 & i) << 10 | 1023 & n.charCodeAt(s)), t.setUint8(e++, 240 | i >> 18), t.setUint8(e++, 128 | i >> 12 & 63)), t.setUint8(e++, 128 | i >> 6 & 63)), t.setUint8(e++, 128 | 63 & i))
}

export function encode(e) {
    const o = {
        type: 2,
        data: ["blueboat_JOIN_ROOM", e],
        options: {
            compress: !0
        },
        nsp: "/"
    };
    return function(t) {
        var e = [],
            i = [],
            s = function t(e, n, i) {
                var s = typeof i,
                    o = 0,
                    r = 0,
                    a = 0,
                    c = 0,
                    l = 0,
                    u = 0;
                if ("string" === s) {
                    if ((l = function(t) {
                            for (var e = 0, n = 0, i = 0, s = t.length; i < s; i++)(e = t.charCodeAt(i)) < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || 57344 <= e ? n += 3 : (i++, n += 4);
                            return n
                        }(i)) < 32) e.push(160 | l), u = 1;
                    else if (l < 256) e.push(217, l), u = 2;
                    else if (l < 65536) e.push(218, l >> 8, l), u = 3;
                    else {
                        if (!(l < 4294967296)) throw new Error("String too long");
                        e.push(219, l >> 24, l >> 16, l >> 8, l), u = 5
                    }
                    return n.push({
                        h: i,
                        u: l,
                        t: e.length
                    }), u + l
                }
                if ("number" === s) return Math.floor(i) === i && isFinite(i) ? 0 <= i ? i < 128 ? (e.push(i), 1) : i < 256 ? (e.push(204, i), 2) : i < 65536 ? (e.push(205, i >> 8, i), 3) : i < 4294967296 ? (e.push(206, i >> 24, i >> 16, i >> 8, i), 5) : (a = i / Math.pow(2, 32) >> 0, c = i >>> 0, e.push(207, a >> 24, a >> 16, a >> 8, a, c >> 24, c >> 16, c >> 8, c), 9) : -32 <= i ? (e.push(i), 1) : -128 <= i ? (e.push(208, i), 2) : -32768 <= i ? (e.push(209, i >> 8, i), 3) : -2147483648 <= i ? (e.push(210, i >> 24, i >> 16, i >> 8, i), 5) : (a = Math.floor(i / Math.pow(2, 32)), c = i >>> 0, e.push(211, a >> 24, a >> 16, a >> 8, a, c >> 24, c >> 16, c >> 8, c), 9) : (e.push(203), n.push({
                    o: i,
                    u: 8,
                    t: e.length
                }), 9);
                if ("object" === s) {
                    if (null === i) return e.push(192), 1;
                    if (Array.isArray(i)) {
                        if ((l = i.length) < 16) e.push(144 | l), u = 1;
                        else if (l < 65536) e.push(220, l >> 8, l), u = 3;
                        else {
                            if (!(l < 4294967296)) throw new Error("Array too large");
                            e.push(221, l >> 24, l >> 16, l >> 8, l), u = 5
                        }
                        for (o = 0; o < l; o++) u += t(e, n, i[o]);
                        return u
                    }
                    if (i instanceof Date) {
                        var h = i.getTime();
                        return a = Math.floor(h / Math.pow(2, 32)), c = h >>> 0, e.push(215, 0, a >> 24, a >> 16, a >> 8, a, c >> 24, c >> 16, c >> 8, c), 10
                    }
                    if (i instanceof ArrayBuffer) {
                        if ((l = i.byteLength) < 256) e.push(196, l), u = 2;
                        else if (l < 65536) e.push(197, l >> 8, l), u = 3;
                        else {
                            if (!(l < 4294967296)) throw new Error("Buffer too large");
                            e.push(198, l >> 24, l >> 16, l >> 8, l), u = 5
                        }
                        return n.push({
                            l: i,
                            u: l,
                            t: e.length
                        }), u + l
                    }
                    if ("function" == typeof i.toJSON) return t(e, n, i.toJSON());
                    var d = [],
                        f = "",
                        p = Object.keys(i);
                    for (o = 0, r = p.length; o < r; o++) "function" != typeof i[f = p[o]] && d.push(f);
                    if ((l = d.length) < 16) e.push(128 | l), u = 1;
                    else if (l < 65536) e.push(222, l >> 8, l), u = 3;
                    else {
                        if (!(l < 4294967296)) throw new Error("Object too large");
                        e.push(223, l >> 24, l >> 16, l >> 8, l), u = 5
                    }
                    for (o = 0; o < l; o++) u += t(e, n, f = d[o]), u += t(e, n, i[f]);
                    return u
                }
                if ("boolean" === s) return e.push(i ? 195 : 194), 1;
                if ("undefined" === s) return e.push(212, 0, 0), 3;
                throw new Error("Could not encode")
            }(e, i, t),
            o = new ArrayBuffer(s),
            r = new DataView(o),
            a = 0,
            c = 0,
            l = -1;
        0 < i.length && (l = i[0].t);
        for (var u, h = 0, d = 0, f = 0, p = e.length; f < p; f++)
            if (r.setUint8(c + f, e[f]), f + 1 === l) {
                if (h = (u = i[a]).u, d = c + l, u.l)
                    for (var g = new Uint8Array(u.l), E = 0; E < h; E++) r.setUint8(d + E, g[E]);
                else u.h ? n(r, d, u.h) : void 0 !== u.o && r.setFloat64(d, u.o);
                c += h, i[++a] && (l = i[a].t)
            } let y = Array.from(new Uint8Array(o));
        y.unshift(4)
        return new Uint8Array(y).buffer 
    }(o)
}

// let encoded = encode({
//     roomId: '6gFW7EcU0ymgRa',
//     options: { intent: '6555307b41c55c002db47a8e' }
// })
// // convert to string
// let string = String.fromCharCode.apply(null, new Uint8Array(encoded))
// console.log(string)
// console.log(string.length)