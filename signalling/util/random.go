package util

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"io"
)

func GenerateRandomString(length int64) (string, error) {
	buf := &bytes.Buffer{}
	_, err := io.CopyN(buf, rand.Reader, length)
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(buf.Bytes())[:length], err
}
