package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.util.StringNormalizeUtil;

public abstract class HcmUtil extends StringNormalizeUtil {

    protected static String normalizeNotes(String notes) {
        return normalizeNullable(notes);
    }
}
