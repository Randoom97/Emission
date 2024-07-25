uniform lowp vec3 lightPositions[100];
uniform lowp vec3 lightColors[100];
uniform int lightLuminance[100];
uniform int lightShape[100];
uniform int lightCount;

varying lowp vec3 position;

lowp float sphereDist(lowp vec3 light, lowp vec3 pixel) {
    return length(pixel - light);
}

// lowp float dotDist(lowp vec3 light, lowp vec3 pixel) {
//     return dot(vec3(1.0), pixel - light);
// }

lowp float cubeDist(lowp vec3 light, lowp vec3 pixel) {
    lowp vec3 p = pixel - light;
    return max(max(abs(p.x), abs(p.y)), abs(p.z));
}

lowp float pyramidDist(lowp vec3 light, lowp vec3 pixel) {
    lowp vec3 p = pixel - light;
    lowp float dist = 0.0;
    dist = max(dot(p, vec3(1.5, 0.9, 0.0)), dist);
    dist = max(dot(p, vec3(-1.5, 0.9, 0.0)), dist);
    dist = max(dot(p, vec3(0.0, 0.9, 1.5)), dist);
    dist = max(dot(p, vec3(0.0, 0.9, -1.5)), dist);
    return max(dot(p, vec3(0.0, -1.5, 0.0)), dist);
}

lowp float cylinderDist(lowp vec3 light, lowp vec3 pixel) {
    lowp vec3 p = pixel - light;
    return max(abs(p.y), length(p.xz));
}

lowp float normalLuminance(lowp float dist) {
    if (dist < 1.0) {
        return 1.0;
    }
    return 0.0;
}

lowp float sinLuminance(lowp float dist) {
    return (sin(dist*20.0)+1.0)/2.0;
}

lowp float squareLuminance(lowp float dist) {
    return ceil(sin(dist*20.0));
}

lowp float sawLuminance(lowp float dist) {
    lowp float period = 1.0/5.0;
    return (dist - (period * floor(dist/period))) * 5.0;
}

lowp float inverseLuminance(lowp float dist) {
    if (dist > 1.0) {
        return 1.0;
    }
    return 0.0;
}

lowp float dist(lowp vec3 light, lowp vec3 pixel, int type) {
    if (type == 1) {
        return cubeDist(light, pixel);
    } else if (type == 2) {
        return pyramidDist(light, pixel);
    } else if (type == 3) {
        return cylinderDist(light, pixel);
    }
    return sphereDist(light, pixel);
}

lowp float luminosity(lowp float d, int type) {
    if (type == 1) {
        return sinLuminance(d);
    } else if (type == 2) {
        return squareLuminance(d);
    } else if (type == 3) {
        return sawLuminance(d);
    } else if (type == 4) {
        return inverseLuminance(d);
    }
    return normalLuminance(d);
}

void main(void) {
    lowp vec3 totalLight = vec3(0.0);
    for(int i = 0; i < 100; i++){
        if (i == lightCount) break; // `lightCount` can't be used in the for bound
        lowp float actualDist = sphereDist(lightPositions[i], position);
        lowp float dist = dist(lightPositions[i], position, lightShape[i]);
        lowp float luminence = luminosity(dist, lightLuminance[i]) * max(1.0 - (actualDist/2.0), 0.0);
        lowp vec3 lightColor = lightColors[i];
        totalLight += lightColor*luminence;
    }
    lowp float falloff = min(1.0/(pow(gl_FragCoord.w, -1.0)*0.5+1.0), 1.0);
    lowp vec3 color = vec3(0.4, 0.4, 0.45);
    gl_FragColor = vec4((color+totalLight) * falloff, 1.0);
}