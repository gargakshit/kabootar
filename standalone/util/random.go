package util

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"io"
	"math/big"
	mrand "math/rand"
	"strings"
)

func GenerateRandomString(length int64) (string, error) {
	buf := &bytes.Buffer{}
	_, err := io.CopyN(buf, rand.Reader, length)
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(buf.Bytes())[:length], err
}

func GeneratePIN() (string, error) {
	num, err := rand.Int(rand.Reader, big.NewInt(999_999-100_000))
	if err != nil {
		return "", nil
	}

	num = num.Add(num, big.NewInt(100_000))
	return num.String(), nil
}

func GenerateRandomWord() string {
	word := bundledDictionary[mrand.Intn(bundledDictionaryLen)]
	return strings.ToUpper(word[:1]) + word[1:]
}

func GenerateRandomEmoji() string {
	return emojiDict[mrand.Intn(emojiDictLen)]
}
